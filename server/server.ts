
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fs from 'fs';

import { default_mime_types } from './mime_types'
import path from 'path';

import { BasicHtml5Page } from './html_generators/basic_html';
import { ArticlePage, MdArticlePage } from './html_generators/article';

import url from 'url';
import logger from './logger';
import redirection_messages from './redirection_messages';
import { extractMeta } from './meta_exctractor';

import { watchFile } from './files_watcher';
import http from 'http';
import { init_io, io } from './io';
import { getHostName, getPort } from './hostname';

import qrcodeTerminal from 'qrcode-terminal';
import { getMyIp } from './my_ip';
import { setup_opn_api } from './api';

const hostname = getHostName();
const port = getPort();
const viewBaseFolder = path.join(__dirname, "../content/");

var app = express();

var server = http.createServer(app);
init_io(server);

function actual_404(res: express.Response) {
	res.status(404);
	res.end("404 not found");
}

function send_404(req : express.Request, res : express.Response) {
	res.status(404);

	res.sendFile(path.join(viewBaseFolder, "404.html"), (err) => {
		if (err) {
			logger.error(`error while sending 404, err: ${err}`);
			actual_404(res);
		}
	});
}

function validate_url(url : string, req : express.Request, res : express.Response) : boolean {
	if (!url.startsWith("/")) {
		logger.error(`url must start with /, url: "${url}"`);
		send_404(req, res);
		return false;
	}

	// see https://stackoverflow.com/questions/65980534/how-to-deal-with-path-traversal
	if (url.match(/\.\.\//g) != null) {
		logger.error(`url contains ../, url: "${url}"`);
		send_404(req, res);
		return false;
	}

	return true;
}

const redirectable_extensions = [".html", ".md"];

function findFile(fileName: string, base: string): string | null {

	let endsWithSlash = false;

	for (let i = 0; i < 2; i++) {
		if (fileName.endsWith("/")) {
			fileName = fileName.substring(0, fileName.length - 1);
			endsWithSlash = true;
		}
	}

	const filePath = path.join(base, fileName);

	if (fs.existsSync(filePath)) {

		if (fs.statSync(filePath).isDirectory()) {

			if (!endsWithSlash) {
				return "///REDIRECT-SLASH///";
			}

			let file = findFile(fileName + "/index.html", base);
			if (file) {
				return file;
			}

			return findFile(fileName + "/index.md", base);
		} else {
			if (endsWithSlash) {
				return "///REDIRECT-NO-SLASH///";
			}
		}

		return filePath;
	}

	return null;
}

function serveProcessedMd(filePath: string, req : express.Request, res: express.Response) {
	let fileContent = fs.readFileSync(filePath, 'utf8');

	let extracted = extractMeta(fileContent);

	let article = new MdArticlePage();

	article.markdown_article = extracted.content;
	article.url = url.parse(req.url).pathname;

	if (extracted.meta) {
		article.useYamlMeta(extracted.meta);
	}

	// check if hostname is a local ip address
	let hostname = req.hostname;
	if ((hostname.match(/^\d+\.\d+\.\d+\.\d+$/) || hostname.match(/^localhost$/)) && false) {
		article.local = true;
		article.fileUrl = filePath;
	} else {
		article.url = article.url.replace(/\\/g, "/");
		filePath = filePath.replace(/\\/g, "/");
		let pos = filePath.indexOf(article.url);
		if (pos != -1) {
			article.fileUrl = path.join(article.url, filePath.substring(pos + article.url.length));
		} else {
			article.fileUrl = article.url;
		}
	}

	logger.info(`serving processed md, filePath: "${filePath}", title: "${article.title}"`);

	res.setHeader("Content-Type", default_mime_types["html"]);
	res.end(article.html);

	// !!!
	watchFile(filePath);
}

function servePlainFile(filePath: string, req : express.Request, res: express.Response) : boolean {
	if (fs.existsSync(filePath)) {
		
		console.log(`serving plain file, filePath: "${filePath}"`);
		res.setHeader("Content-Type", default_mime_types["txt"]);
		let stream = fs.createReadStream(filePath);

		// me: is it necessary to end the response after createReadStream and pipe?
		// copilot: yes, it is necessary to end the response after createReadStream and pipe

		stream.on('end', () => {
			console.log("stream ended");
			res.end();
		});

		stream.pipe(res);

		return true;
	}
	
	return false;
}

function serveFile(filePath: string, req : express.Request, res: express.Response, processed : boolean = true) : boolean {
	if (fs.existsSync(filePath)) {

		if (processed) {
			// here te files that are not directly served but have to be processed before serving

			// markdown gets processed
			if (filePath.endsWith(".md")) {
				serveProcessedMd(filePath, req, res);
				return true;
			}
		}

		res.sendFile(filePath);
		watchFile(filePath);
		return true;
	}

	if (!processed) {
		return false;
	}

	// TODO if .html and not found, try .md
	let htmlExt = ".html";
	if (filePath.endsWith(".html")) {
		let stripped = filePath.substring(0, filePath.length - htmlExt.length);

		if (serveFile(stripped + ".md", req, res, processed)) { return true; }
	}

	return false;
}

function serveFolderChildrenIndex(folderPath: string, res: express.Response) {
	// get all the childs
	const files = fs.readdirSync(folderPath);

	let html = "";

	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		const filePath = path.join(folderPath, file);

		if (fs.statSync(filePath).isDirectory()) {
			html += `<a href="${file}/">${file}/</a><br>`;
		} else {
			html += `<a href="${file}">${file}</a><br>`;
		}
	}

	let page = new BasicHtml5Page();
	page.title = "Dir Index";
	page.body_content = html;

	res.setHeader("Content-Type", default_mime_types["html"]);
	res.end(page.html);
}

function serveFolder(filePath: string, req : express.Request, res: express.Response) {
	
	if (!fs.existsSync(filePath)) {
		logger.error(`folder does not exist, filePath: "${filePath}`);

		send_404(req, res);
		return;
	}

	if (!fs.statSync(filePath).isDirectory()) {
		logger.error(`filePath is not a folder, filePath: "${filePath}"`);

		send_404(req, res);
		return;
	}

	let indexFilePath = path.join(filePath, "index.html");

	if (serveFile(indexFilePath, req, res, true)) {
		return;
	}

	serveFolderChildrenIndex(filePath, res);
}

setup_opn_api(app);

app.get("/favicon.ico", function(req : express.Request, res : express.Response) {
	// send "content/favico.svg"
	let file = "favicon2.svg";
	
	let fpath = path.join(__dirname, "../content/", file);

	res.sendFile(fpath, {}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Sent file:", file);
		}
	});
});

app.get(`/*`, function(req : express.Request, res : express.Response) {
	let parsedUrl = url.parse(req.url, true);
	let pathname = parsedUrl.pathname;

	if (!validate_url(pathname, req, res)) {
		return;
	}

	//let localPath = path.normalize(path.join(viewBaseFolder, pathname));

	let filePath = findFile(pathname, viewBaseFolder);

	if (!filePath) {
		send_404(req, res);
		return;
	}

	if (filePath == "///REDIRECT-SLASH///") {
		res.redirect(redirection_messages.SeeOther, pathname + "/");
		return;
	}

	if (filePath == "///REDIRECT-NO-SLASH///") {
		res.redirect(redirection_messages.SeeOther, pathname.slice(0, -1));
		return;
	}

	let stat = fs.statSync(filePath);

	if (stat.isDirectory()) {
		serveFolder(filePath, req, res);
		return;
	}

	if (stat.isFile()) {
		let raw = req.query["raw"] !== undefined ? true : false;
		let plain = req.query["plain"] !== undefined ? true : false;
		if (!raw && plain) {
			servePlainFile(filePath, req, res);
		} else {
			serveFile(filePath, req, res, !raw);
		}
		return;
	}
});

app.get('/*.md', function(req : express.Request, res : express.Response) {

	let page = new ArticlePage;
	page.article_html_content = "Hello World";
	page.scripts.push({ src: "/a.js", async: true });
	page.styleSheets.push("/a.css");

	res.setHeader('Content-Type', 'text/plain');
	res.end(page.html);
});

app.get('/*', function(req : express.Request, res : express.Response) {

	res.setHeader('Content-Type', 'text/html');
	res.end(`<!DOCTYPE html>
		<html>
			<head>
				<title>Hello World</title>
			</head>
			<body>
				<h1>Hello World</h1>
			</body>
		</html>`);
	//res.end('You\'re in reception');
});

server.listen(port, hostname, () => {
	logger.info(`server listening on port ${port}`);

	let local_url = `http://${hostname}:${port}`;

	if (hostname != "localhost") {
		qrcodeTerminal.generate(local_url, { small: true });
	}

	logger.info(`\n\n\n================================\n\n\n`);

	logger.info(`server is listening on ${local_url}`);
});
// listen from server, not from app!
// see https://towardsdatascience.com/building-a-real-time-web-app-in-nodejs-express-with-socket-io-library-d9b50aded6e6
//app.listen(port, "10.0.1.5", () => {
//	logger.info(`server listening on port ${port}`);
//});


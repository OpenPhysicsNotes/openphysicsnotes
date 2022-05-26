

import * as http from 'http'
import path from 'path';
import fs from 'fs';

import Markdown2Html from './markdown';

import { networkInterfaces } from 'os';

import { ArticlePage, ArticlePathElement, RelatedArticle } from './ArticlePage';

import { Server } from 'socket.io';

import qrcodeTerminal from 'qrcode-terminal'

class NetworkInterface {
	name: string;
	addresses: string[] = [];
}

// https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js

function getNetworkAdresses() {
	const nets = networkInterfaces();

	const results : NetworkInterface[] = [];
	
	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
			// 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
			const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
			if (net.family === familyV4Value && !net.internal) {
				if (!results[name]) {
					results[name] = [];
				}
				let tmp_interface = new NetworkInterface();
				tmp_interface.name = name;
				tmp_interface.addresses.push(net.address);
				results.push(tmp_interface);
				//results[name].push(net.address);
			}
		}
	}

	return results;
}

const root = __dirname + "/../content";

class RequestPath {

	path_list : string[] = [];
	query : string = ""
	
	constructor(path: string, query: string) {
		path.split("/").forEach(p => {
			if (p !== "") {
				this.path_list.push(p);
			}
		});

		this.query = query;
	}
	
	static parse(path: string) : RequestPath {

		let splitted = path.split("?");
		
		const query = splitted[1];
		
		return new RequestPath(splitted[0], query);
	}
	
	static parseFromRequest(request: http.IncomingMessage) : RequestPath {
		
		const path = request.url;
		
		return RequestPath.parse(path);
	}
	
	static fromRequest(request: http.IncomingMessage) : RequestPath {
		
		const path = request.url;
		
		return RequestPath.parse(path);
	}
	

	get path() : string {
		return this.path_list.join("/");
	}
}

let watchingFiles = new Map<string, fs.FSWatcher>();

var io : Server | null = null;

function watchFile(filePath: string) {
	if (!watchingFiles.has(filePath)) {
		watchingFiles.set(filePath, fs.watch(filePath, (eventType, filename) => {
			console.log(`${filePath} changed.`);
			console.log(`${eventType} ${filename}`);

			//io.sockets.send(`${filePath} changed.`);
			if (io) {
				io.sockets.emit(`file-changed`, filePath);
			}
		}));
	}
}

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
		}

		return filePath;
	}
	return null;
}

function isHtmlFile(fileName: string): boolean {
	return fileName.endsWith(".html");
}

function isMarkdownFile(fileName: string): boolean {
	return fileName.endsWith(".md");
}

function isIcoFile(fileName: string): boolean {
	return fileName.endsWith(".ico");
}

let markdownParser = new Markdown2Html();

function serveMarkdownFile(filePath: string, response: http.ServerResponse, path : RequestPath) : boolean {
	if (!isMarkdownFile(filePath)) {
		return false;
	}

	watchFile(filePath);

	let processed = markdownParser.process(fs.readFileSync(filePath, 'utf-8'));

	response.writeHead(200, {
		'Content-Type': 'text/html'
	});

	let title = "???";
	if (processed.meta.title) {
		title = processed.meta.title;
	}

	let page = new ArticlePage();

	page.title = title;
	page.article_content = processed.html;

	if (processed.meta.related_articles instanceof Array) {
		
		for (let related_article of processed.meta.related_articles) {
			let article = new RelatedArticle();

			article.title = related_article.title;
			article.href = related_article.href || related_article.url;
			
			page.related_articles.push(article);
		}
	}

	let tmp_path = "/";
	let e = new ArticlePathElement(tmp_path, tmp_path)
	page.article_path_elements.push(e);
	for (let path_elem of path.path_list) {
		tmp_path += path_elem + "/";
		let e = new ArticlePathElement(tmp_path, path_elem);
		page.article_path_elements.push(e);
	}

	response.write(page.to_html_page());
	response.end();

	return true;
}

function serveHtmlFile(filePath: string, response: http.ServerResponse) : boolean {
	if (!isHtmlFile(filePath)) {
		return false;
	}

	response.writeHead(200, {
		'Content-Type': 'text/html'
	});

	fs.createReadStream(filePath).pipe(response);

	return true;
}

function serveIcoFile(filePath: string, response: http.ServerResponse) : boolean {
	if (!isIcoFile(filePath)) {
		return false;
	}

	response.writeHead(200, {
		'Content-Type': 'image/x-icon'
	});

	fs.createReadStream(filePath).pipe(response);

	return true;
}

function serveRawFile(filePath: string, response: http.ServerResponse) : void {
	fs.createReadStream(filePath).pipe(response);
	// or... https://stackoverflow.com/questions/51962554/node-js-transfer-large-files-without-consuming-a-lot-of-memory
}

function serveFile(filePath: string, response: http.ServerResponse, path : RequestPath) {
	
	// Markdown
	if (serveMarkdownFile(filePath, response, path)) { return; }

	// Html
	if (serveHtmlFile(filePath, response)) { return; }

	// Ico
	// https://stackoverflow.com/questions/39552736/set-favicon-in-http-server
	if (serveIcoFile(filePath, response)) { return; }

	// any other file
	serveRawFile(filePath, response);
}




export default function(netname : string, port : number) {
	
	let host = "localhost";
	
	if (netname) {
		let nets = networkInterfaces();

		// check if we have a network interface with the given name
		if (nets[netname]) {
			let found = false;
			for (let net of nets[netname]) {
				if (net.family === "IPv4") {
					host = net.address;
					found = true;
					break;
				}
			}
			if (!found) {
				throw new Error("net " + netname + " has no IPv4 address");
			}
		} else {
			throw new Error("No network interface with name " + netname);
		}
	}

	const server = http.createServer((req : http.IncomingMessage, res : http.ServerResponse) => {
		console.log(req.url);
	
		let tmp_url = req.url.slice(1);
	
		if (!tmp_url) {
			tmp_url = "/";
		}
	
		console.log("tmp_url", tmp_url)
		let path = RequestPath.parse(tmp_url);
	
		const filePath = findFile(tmp_url.split("?")[0], root);
	
		console.log(`query`, path.path, path.query);
		console.log("filePath", filePath);
	
		if (filePath) {
	
			if (filePath === "///REDIRECT-SLASH///") {
				console.log("redirecting to", "/" + path.path + '/' + (path.query ? '?' + path.query : ''));
				res.writeHead(303, {
					// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages
					'Location': "/" + path.path + '/' + (path.query ? '?' + path.query : '')
				});
				res.end();
				return;
			}
	
			if (path.query === "raw") {
				console.log("raw", filePath);
				serveRawFile(filePath, res);
				return;
			}
	
			serveFile(filePath, res, path);
		} else {
			res.writeHead(404);
			res.end();
		}
	});
	
	server.listen(port, host, () => {
		let local_url = `http://${host}:${port}`;
		if (netname) {
			qrcodeTerminal.generate(local_url, { small: true });
		}
		console.log(`Server is running on ${local_url}`);
		console.log(__dirname);
	});
	
	io = new Server(server);
	
	io.on('connection', (socket) => {
		console.log('a user connected');
	});
}
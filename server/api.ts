
import express from "express";

import { exec } from "child_process";
import logger from "./logger";
import { sleepMs } from "./sleep";
import { send_404 } from "./404";

import drive_kfs from './drive/drive_kfs';
import path from "path";

import crypto from "crypto";

import fs from "fs";

function hello(req: express.Request, res: express.Response, next: express.NextFunction) {
	//res.contentType("application/json");
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify({
		hello: "world!",
		your_query: req.query
	}));
	res.end();
}

function answer(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.send(JSON.stringify({
		answer: 42
	}));
	res.end();
}

class PullStatus {
	public status: "none" | "pending" | "success" | "error" = "none";
	public stdout: string = "";
	public stderr: string = "";
	public errorMsg: string = "";

	public startTime: Date | null = null;
	public endTime: Date | null = null;
}

/**
 * true if a git pull is currently in progress
 */
let _pulling = false;

/**
 * true if a git pull has been requested but another pull is currently in progress
 */
let _to_pull = false;

/**
 * The last git pull status
 */
let _last_pull_status : PullStatus = new PullStatus();

/**
 * Perform git pull on the server
 */
function git_pull() : void {

	logger.info("git_pull called");

	if (_pulling) {
		_to_pull = true;
		return;
	}

	_pulling = true;
	_to_pull = false;
	logger.info("git_pull: pulling");
	_last_pull_status = new PullStatus();
	_last_pull_status.startTime = new Date();
	_last_pull_status.status = "pending";
	exec("git pull", (error, stdout, stderr) => {

		_last_pull_status.stdout = stdout;
		_last_pull_status.stderr = stderr;
		_last_pull_status.endTime = new Date();

		if (error) {
			_last_pull_status.status = "error";
			_last_pull_status.errorMsg = error.message;
			logger.error(`exec error for "git pull": ${error}`);
			logger.info(`git_pull: stdout: ${stdout}`);
			logger.info(`git_pull: stderr: ${stderr}`);
		} else {
			_last_pull_status.status = "success";
			logger.info("git_pull: completed");
			logger.info(`git_pull: stdout: ${stdout}`);
		}

		sleepMs(5000).then(() => {
			_pulling = false;
			if (_to_pull) {
				git_pull();
			}
		});
	});
}

function git_pull_api(req: express.Request, res: express.Response, next: express.NextFunction) {

	let pulling = _pulling;

	git_pull();

	res.contentType("application/json");
	res.send(JSON.stringify({
		git_pull: !pulling ? "pulling" : "pulling queued"
	}));
	res.end();
}

function git_pull_status_api(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.contentType("application/json");
	res.send(JSON.stringify(_last_pull_status));
	res.end();
}

namespace Drive {
	export namespace fsa {
		export function list_dir(req: express.Request, res: express.Response, next: express.NextFunction) {

			let dir = req.query.dir;
			
			if (!(typeof dir === "string")) {
				send_404(req, res);
				return;
			}

			dir = path.join("blob/now", dir);
			dir = dir.replace(/\\/g, "/");

			if (!dir.endsWith("/")) {
				dir += "/";
			}

			if (dir.indexOf("..") >= 0) {
				send_404(req, res);
				return;
			}

			let actual_dir = path.join(drive_kfs.KFS_DIR, dir);
			console.log(`list_dir: dir: ${dir}`);

			// get the list of files and subdirs
			fs.readdir(actual_dir, (err, files) => {
				if (err) {
					send_404(req, res);
					return;
				}

				let result = {
					dir: dir,
					items: []
				};

				files.forEach(file => {
					let file_path = path.join(actual_dir, file);
					let stats = fs.statSync(file_path);
					if (stats.isDirectory()) {
						result.items.push({
							name: file,
							type: "dir"
						});
					} else {
						result.items.push({
							name: file,
							type: "file"
						});
					}
				});

				res.contentType("application/json");
				res.send(JSON.stringify(result));
				res.end();
			});

			/*if (!(files instanceof Array)) {
				send_404(req, res);
				return;
			}

			res.contentType("application/json");

			let json = JSON.stringify(files.map(f => {
				return {
					name: path.relative(dir as string, f).replace(/\.json$/g, ""),
				};
			}));
			res.send(json);*/
		}

		export function delete_item(req: express.Request, res: express.Response, next: express.NextFunction) {
			const item_path = req.query.path;

			if (!(typeof item_path === "string")) {
				send_404(req, res);
				return;
			}

			const kfs_item_path = path.join("blob/now", item_path);

			if (item_path.indexOf("..") >= 0) {
				send_404(req, res);
				return;
			}

			let json = drive_kfs.kfs[kfs_item_path];

			// TMP!!!!
			let json_v = false;
			if (!json) {
				json = drive_kfs.kfs[kfs_item_path + ".json"];
				if (json) {
					json_v = true;
				}
			}

			console.log(kfs_item_path, json);

			// TODO schedule for ref check and deletion if necessary!!!!

			delete drive_kfs.kfs[kfs_item_path + (json_v ? ".json" : "")];

			res.contentType("application/json");
			res.send(JSON.stringify({
				delete_item: "success"
			}));
			res.end();
		}

		// TODO delete_item_ever, only for admins, owners, content owners or "attributed to" user

		export function make_dir(req: express.Request, res: express.Response, next: express.NextFunction) {
			const dir_path = req.query.path;

			if (!(typeof dir_path === "string")) {
				send_404(req, res);
				return;
			}

			const kfs_dir_path = path.join("blob/now", dir_path);

			if (dir_path.indexOf("..") >= 0) {
				send_404(req, res);
				return;
			}

			// create the directory
			const actual_dir = path.join(drive_kfs.KFS_DIR, kfs_dir_path);

			fs.mkdirSync(actual_dir, { recursive: true });

			res.contentType("application/json");
			res.send(JSON.stringify({
				make_dir: "success",
				path: dir_path,
				kfsPath: kfs_dir_path
			}));
		}

		function for_each_file_in_dir_recursive(dir: string, callback: (file: string, fileName : string) => void) {
			let files = fs.readdirSync(dir);
			for (let file of files) {
				let file_path = path.join(dir, file);
				let stat = fs.statSync(file_path);
				if (stat.isDirectory()) {
					for_each_file_in_dir_recursive(file_path, callback);
				} else {
					callback(file_path, file);
				}
			}
		}
	
		export function clean_unused_files(req: express.Request, res: express.Response, next: express.NextFunction) {
	
			let used_files : string[] = [];
			let removed_files : string[] = [];
			let failed_to_delete : string[] = [];
	
			for_each_file_in_dir_recursive(drive_kfs.KFS_DIR, (file: string) => {
				let file_content = fs.readFileSync(file, "utf8");
				let file_json = JSON.parse(file_content);
				if (!file_json.ref) {
					return;
				}
				if (file_json.ref) {
					used_files.push(file_json.ref);
				}
			});
	
			function is_used(file: string) {
				return used_files.indexOf(file) >= 0;
			}
	
			for_each_file_in_dir_recursive(drive_kfs.KFS_RAW_STORAGE_DIR, (filePath: string, fileName) => {
				if (!is_used(fileName)) {
					try {
						fs.unlinkSync(filePath);
						removed_files.push(fileName);
					} catch (e) {
						failed_to_delete.push(fileName);
					}
				}
			});
	
			res.contentType("application/json");
			res.send(JSON.stringify({
				clean_result: "success",
				removed_files_count: removed_files.length,
				removed_files: removed_files,
				failed_to_delete_count: failed_to_delete.length,
				failed_to_delete: failed_to_delete
			}));
			res.end();
		}
	}

	/**
	 * This function receiver large files from the client and writes them to disk.
	 * @param req 
	 * @param res 
	 * @param next 
	 */
	export function upload_file(req: express.Request, res: express.Response, next: express.NextFunction) {
		
		let dir = req.query.dir as string;
		let file = req.query.file as string;

		//const tmp_folder = path.join(drive_kfs.KFS_RAW_STORAGE_DIR, "tmp/uploads").replace(/\\/g, "/");

		// sha256 of the file name + date/time
		const sub_hash = crypto.createHash("sha256").update(dir + file + new Date().getTime()).digest("hex").substring(0, 8);

		/*if (!fs.existsSync(tmp_folder)) {
			fs.mkdirSync(tmp_folder, { recursive: true });
		}*/

		if (!(typeof dir === "string")) {
			console.log("dir is not a string");
			send_404(req, res);
			return;
		}

		if (!file || !(typeof file === "string")) {
			console.log("file is not a string");
			send_404(req, res);
			return;
		}

		if (dir.indexOf("..") >= 0) {
			console.log("dir contains ..");
			send_404(req, res);
			return;
		}

		if (file.indexOf("..") >= 0) {
			console.log("file contains ..");
			send_404(req, res);
			return;
		}

		let actual_dir = path.join(drive_kfs.KFS_RAW_STORAGE_DIR);
		console.log(`upload_file: actual_dir: ${actual_dir}`);

		if (!fs.existsSync(actual_dir)) {
			fs.mkdirSync(actual_dir);
		}

		// TODO move
		function zerosPadding(num: number, size: number) {
			return String(num).padStart(size, "0");
		}

		// move the file to the correct location
		const D = new Date();
		const date_string = D.getUTCFullYear() + "-" + zerosPadding(D.getUTCMonth() + 1, 2) + "-" + zerosPadding(D.getUTCDate(), 2) + "--" + zerosPadding(D.getUTCHours(), 2) + "-" + zerosPadding(D.getUTCMinutes(), 2) + "-" + zerosPadding(D.getUTCSeconds(), 2) + "-" + zerosPadding(D.getUTCMilliseconds(), 3);
		const actual_file_name = date_string + "-" + sub_hash + "." + file;
		const actual_file_path = path.join(actual_dir, actual_file_name).replace(/\\/g, "/");
		console.log(`upload_file: actual_file_path: ${actual_file_path}`);

		let file_stream = fs.createWriteStream(actual_file_path);
		req.pipe(file_stream);

		req.on("end", () => {

			file_stream.end();
			res.contentType("application/json");
			res.send(JSON.stringify({
				upload_file: "success"
			}));
			res.end();

			/*if (fs.existsSync(actual_file_path)) {
				fs.unlinkSync(actual_file_path);
			}*/

			// save the file to the database
			let file_data = {
				name: file,
				ref: actual_file_name,
				// TODO path
			}

			// copilot said:
			// let db = new sqlite3.Database(drive_kfs.KFS_DB_PATH);
			// db.run("INSERT INTO files (name, ref) VALUES (?, ?)", [file, actual_file_name]);
			// db.close();

			let kfs = drive_kfs.kfs;
			kfs[path.join("blob/now", dir, file).replace(/\\/g, '/')] = file_data;
			console.log(`upload_file: kfs: ${path.join("blob/now", dir, file).replace(/\\/g, '/')}`);
		});
	}
}

function default_api(req: express.Request, res: express.Response, next: express.NextFunction) {
	next();
}

export function setup_opn_api(app : express.Application) {

	app.get("/api/hello", hello);

	app.get("/api/answer", answer);

	app.get("/api/git/pull", git_pull_api);
	app.get("/api/git/pull/status", git_pull_status_api);

	app.get("/api/drive/fs/list_dir", Drive.fsa.list_dir);
	app.get("/api/drive/fs/make_dir", Drive.fsa.make_dir);
	app.get("/api/drive/fs/delete", Drive.fsa.delete_item);
	app.get("/api/drive/fs/clean_unused_files", Drive.fsa.clean_unused_files);
	app.post("/api/drive/upload", Drive.upload_file);

	app.get("/api/*", default_api);

	//app.get("/api", default_api, hello);

}
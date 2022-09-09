import path from "path"

import fs from "fs"

import drive_kfs from "./drive_kfs"

import express from 'express';
import { send_404 } from "../404";

import proxy_ from 'http-proxy';
import logger from "../logger";

const BASE = "drive"
const CONTENT = "content"
const CONTENT_PATH = path.join(BASE, CONTENT);

const DRIVE_PROXY_ENABLED = process.env.FALLBACK_DRIVE_PROXY !== 'false'
const DRIVE_PROXY = process.env.FALLBACK_DRIVE_PROXY || 'http://openphysicsnotes.org';

let proxy : proxy_ | null;
if (DRIVE_PROXY_ENABLED) {
	proxy = proxy_.createProxyServer({
		target: DRIVE_PROXY
	})
}

const BLOB = "blob"
const NOW = 'now';

function toBlobTag(date : string) : string {
	return NOW;
}

function dateToBlobTag(date : Date) {
	return NOW;
}

/*function toContentPath(_path : string, date? : string | Date) : string {
	
	if (!date) {
		date = NOW;
	}

	if (date instanceof Date) {
		date = dateToBlobTag(date);
	}

	let result = path.join(CONTENT_PATH, BLOB, date, _path).replace(/\\/g, '/');

	return result;
}*/

export function serveFile(filePath : string, req : express.Request, res : express.Response) {

	const jsonPath = filePath;

	console.log("jsonPath", jsonPath);

	const call_proxy = () => {
		if (!DRIVE_PROXY_ENABLED) {
			return;
		}

		logger.info(`proxying to ${DRIVE_PROXY}`);

		proxy.web(req, res, null, (proxy_error) => {
			console.log("proxy_error", proxy_error);
		})
	};

	let rawPath = "";
	try {
		// try to get the actual file path
		rawPath = drive_kfs.getRawFilePath(jsonPath);
	} catch (e) {
		logger.warn(`drive, serveFile, cound not find ${filePath}`);
		call_proxy();
		return;

		send_404(req, res);
		return;
	}

	if (!rawPath) {
		send_404(req, res);
		return;
	}

	// try to set the correct extension
	let ext = path.extname(filePath);
	if (ext) {
		res.type(ext)
	}

	// send the actual file
	if (fs.existsSync(rawPath)) {
		res.sendFile(path.resolve(rawPath));
	} else {
		call_proxy();
	}
}

export default { /*toContentPath, */serveFile };
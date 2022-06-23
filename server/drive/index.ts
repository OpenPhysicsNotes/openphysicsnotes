import path from "path"

import fs from "fs"

import drive_kfs from "./drive_kfs"

import express from 'express';
import { send_404 } from "../404";

const BASE = "drive"
const CONTENT = "content"
const CONTENT_PATH = path.join(BASE, CONTENT);

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

	let rawPath = "";
	try {
		// try to get the actual file path
		rawPath = drive_kfs.getRawFilePath(jsonPath);
	} catch (e) {
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
	res.sendFile(path.resolve(rawPath));
}

export default { /*toContentPath, */serveFile };
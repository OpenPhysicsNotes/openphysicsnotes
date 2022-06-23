
import _kfs from 'key-file-storage'
import path from 'path';

const KFS_BASE_DIR = "./tmp/drive"
const KFS_DIR = path.join(KFS_BASE_DIR, "kfs");
const KFS_RAW_STORAGE_DIR = path.join(KFS_BASE_DIR, "raw_storage");

const kfs = _kfs(KFS_DIR);

function query_kfs(path : string) : Object | string[] | null {
	let data = kfs[path];

	if (data) {
		return data;
	}

	if (!path.endsWith("/")) {
		return query_kfs(path + '/');
	}

	return null;
}

function exist(path : string) : boolean {
	return query_kfs(path) !== null;
}

function isDir(path : string) {
	return query_kfs(path) instanceof Array;
}

function isFile(path : string) {
	let q = query_kfs(path);
	return q instanceof Object && !(q instanceof Array);
}

function getRawFilePath(_path : string) : string {

	if (!isFile(_path)) {
		throw new Error("Not a file");
	}

	let q = query_kfs(_path);

	if (!q) {
		throw new Error("Not found");
	}

	let ref = q["ref"];

	if (!ref) {
		throw new Error("Ref not found");
	}

	if (typeof ref !== "string") {
		throw new Error("Ref is not a string");
	}

	console.log(ref);
	console.log(path.join(KFS_RAW_STORAGE_DIR, ref).replace(/\\/g, "/"));

	return path.join(KFS_RAW_STORAGE_DIR, ref).replace(/\\/g, "/");
}

export default {
	KFS_BASE_DIR,
	KFS_DIR,// "root"?
	KFS_RAW_STORAGE_DIR,
	kfs,
	query_ksf: query_kfs,
	exist,
	isDir,
	isFile,
	getRawFilePath
}
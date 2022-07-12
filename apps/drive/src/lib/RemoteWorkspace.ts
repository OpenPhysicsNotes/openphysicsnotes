
// https://stackoverflow.com/questions/12881212/does-typescript-support-events-on-classes
// https://gist.github.com/JasonKleban/50cee44960c225ac1993c922563aa540

import path from 'path-browserify';
import { API_HOST } from '../api_host';

import { FolderItem, FolderItemType } from './FolderItem';

/**
 * A remote workspace is a folder that can be accessed by a remote client.
 */
export abstract class RemoteWorkspace {

	private _name: string;

	constructor(name: string) {
		this._name = name;
	}

	get name(): string {
		return this._name;
	}

	//protected abstract list_dir_impl<K extends keyof PromiseOrValue<void>>(dir : string, async_ : K): PromiseOrValue<[]>[K];

	/**
	 * Lists the contents of a directory.
	 * @param dir The directory to list.
	 */
	abstract listDirSync(dir: string): FolderItem[];

	/**
	 * Lists the contents of a directory.
	 * @param dir The directory to list.
	 */
	abstract listDirAsync(dir: string): Promise<FolderItem[]>;

	/**
	 * Delete a file or directory.
	 */
	abstract deleteAsync(path: string): Promise<boolean>;

	/**
	 * Create a new folder
	 */
	abstract makeDir(path: string) : Promise<boolean>;
}

// https://stackoverflow.com/questions/316781/how-to-build-query-string-with-javascript
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

export class OPNRemoteWorkspace extends RemoteWorkspace {

	private _url: string;

	private readonly DRIVE_PATH = "/api/drive";

	constructor(name: string, url: string = API_HOST) {
		super(name);
		this._url = url;
	}

	private listDir_request(dir: string, async_ : boolean): XMLHttpRequest {
		let params = new URLSearchParams({
			dir: dir,
		});

		const url = this._url.replace(/\/$/, '') + this.DRIVE_PATH + "/fs/list_dir" + '?' + params.toString();

		const xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, async_);
		xmlHttp.setRequestHeader("Content-Type", "application/json");

		return xmlHttp;
	}

	private listDir_parse_response(xmlHttp: XMLHttpRequest, dir : string): FolderItem[] {
		const response = JSON.parse(xmlHttp.responseText);
		const items = response.items;

		function to_FolderItem(json: any): FolderItem {

			let type = (json.type as string).toLowerCase();

			return {
				name: json.name,
				complete_path: dir + "/" + json.name,
				type: (type === "dir" || type === 'folder') ? FolderItemType.Folder : FolderItemType.File,
			};
		}

		if (items instanceof Array) {
			return items.map(to_FolderItem);
		}

		return [];
	}

	override listDirSync(dir: string): FolderItem[] {

		let xmlHttp = this.listDir_request(dir, false);
		xmlHttp.send( null );

		return this.listDir_parse_response(xmlHttp, dir);
	}

	override listDirAsync(dir: string): Promise<FolderItem[]> {
		
		let xmlHttp = this.listDir_request(dir, true);

		return new Promise<FolderItem[]>((resolve, reject) => {
			/*xmlHttp.onreadystatechange = () => {
				if (xmlHttp.readyState === 4) {*/
			
			xmlHttp.onload = () => {
				if (xmlHttp.status === 200) {
					resolve(this.listDir_parse_response(xmlHttp, dir));
				}
				else {
					reject(xmlHttp.statusText);
				}
			}
			xmlHttp.onerror = () => {
				reject(xmlHttp.statusText);
			}
			xmlHttp.send( null );
		});
	}

	override deleteAsync(path: string): Promise<boolean> {
		let xmlHttp = new XMLHttpRequest();

		const url = this._url + this.DRIVE_PATH + "/fs/delete?" + new URLSearchParams({path: path}).toString();

		xmlHttp.open("GET", url, true);

		return new Promise<boolean>((resolve, reject) => {
			xmlHttp.onload = () => {
				if (xmlHttp.status === 200) {
					resolve(true);
				}
				else {
					reject(xmlHttp.statusText);
				}
			}
			xmlHttp.onerror = () => {
				reject(xmlHttp.statusText);
			}
			xmlHttp.send( null );
		});
	}

	override makeDir(path: string) : Promise<boolean> {
		let xmlHttp = new XMLHttpRequest();

		const url = this._url + this.DRIVE_PATH + "/fs/make_dir?" + new URLSearchParams({path: path}).toString();

		xmlHttp.open("GET", url, true);

		return new Promise<boolean>((resolve, reject) => {
			xmlHttp.onload = () => {
				if (xmlHttp.status === 200) {
					resolve(true);
				}
				else {
					reject(xmlHttp.statusText);
				}
			}
			xmlHttp.onerror = () => {
				reject(xmlHttp.statusText);
			}
			xmlHttp.send( null );
		});
	}
}

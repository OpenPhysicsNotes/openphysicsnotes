
import fs from 'fs';
import { FSWatcher } from 'fs';

import logger from './logger';

import { io } from './io';

let _watcher_enabled = false;

/*if (process.env.NODE_ENV === 'development') {
	  _watcher_enabled = true;
}
if (process.env.NODE_ENV === 'production') {
	  _watcher_enabled = false;
}*/
if (process.env.ONLINE === 'true') {
	_watcher_enabled = false;
} else {
	_watcher_enabled = true;
}

export const watcher_enabled = _watcher_enabled;

var watchingFiles = new Map<string, FSWatcher>();

/**
 * 
 * @param filePath 
 */
export function watchFile(filePath: string) {

	if (!watcher_enabled) {
		return;
	}

	// if not watching, start watching
	if (!watchingFiles.has(filePath)) {

		function onFileChanged(eventType : fs.WatchEventType, filename : string) {
			logger.info(`${filePath} changed.`);
			logger.info(`${eventType} ${filename}`);
		
			//io.sockets.send(`${filePath} changed.`);
			if (io) {
				io.sockets.emit(`file-changed`, filePath);
			}
		}

		let watcher : FSWatcher = fs.watch(filePath, onFileChanged);

		// add to watching list
		watchingFiles.set(filePath, watcher);
	}
}
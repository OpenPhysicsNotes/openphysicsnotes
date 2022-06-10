
import fs from 'fs';
import { FSWatcher } from 'fs';

import logger from './logger';

import { io } from './io';

var watchingFiles = new Map<string, FSWatcher>();

/**
 * 
 * @param filePath 
 */
export function watchFile(filePath: string) {

	if (process.env.ONLINE === 'true') {
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
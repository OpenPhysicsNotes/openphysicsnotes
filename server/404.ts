
import express from 'express'

import path from 'path';

import logger from './logger';

import { viewBaseFolder } from './tmp';

export function actual_404(res: express.Response) {
	res.status(404);
	res.end("404 not found");
}

export function send_404(req : express.Request, res : express.Response) {
	res.status(404);

	res.sendFile(path.join(viewBaseFolder, "404.html"), (err) => {
		if (err) {
			logger.error(`error while sending 404, err: ${err}`);
			actual_404(res);
		}
	});
}
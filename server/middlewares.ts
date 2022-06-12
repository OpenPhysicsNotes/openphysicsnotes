
import express from 'express'
import logger from './logger';

import compression from 'compression';


function setup_compression(app : express.Application) {
	let use_compression = false;

	if (process.env.COMPRESSION === "true") {
		logger.info("compression enabled");
		use_compression = true;
	} else if (process.env.COMPRESSION === "false") {
		logger.info("compression disabled");
		use_compression = false;
	} else if (process.env.COMPRESSION === "auto") {
		logger.info("compression auto");
		// TODO auto
		use_compression = true;
	} else if (!process.env.COMPRESSION) {
		logger.info(`COMPRESSION env variable is not set, using default value "false"`);
		use_compression = false;
	} else {
		logger.error(`COMPRESSION env variable is set to invalid value: "${process.env.COMPRESSION}, using default value "false"`);
	}

	if (use_compression) {
		logger.info("using compression");
		app.use(compression());
	}
}

export function setup_middlewares(app : express.Application) {
	setup_compression(app);
}
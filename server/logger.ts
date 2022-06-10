

import winston from "winston";

// see https://www.npmjs.com/package/winston
// see https://stackify.com/node-js-logging/

const logFormat = winston.format.combine(
	//winston.format.colorize(),
	winston.format.timestamp(),
	winston.format.align(),
	winston.format.printf(info => {
		return `${info.timestamp} ${info.level.toUpperCase()} ${info.message}`;
	})
);


const logger = winston.createLogger({
	level: "info",
	defaultMeta: { service: 'user-service' },
	transports: [
		new winston.transports.File({ filename: 'server_logs/error.log', level: 'error', format: logFormat }),
		new winston.transports.File({ filename: 'server_logs/combined.log', format: logFormat }),
		new winston.transports.File({ filename: 'server_logs/combined.json', format: winston.format.json() })
	]
})

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: logFormat
	}));
}

export default logger;
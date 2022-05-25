

import server from './server';

import { argv } from 'process';

if (argv.length > 2) {
	server(argv[2], 80);
} else {
	server("", 8000);
}

// https://stackoverflow.com/questions/20273128/how-to-get-my-external-ip-address-with-node-js

import http from "http";

var options = {
	host: 'ipv4bot.whatismyipaddress.com',
	port: 80,
	path: '/'
};

//export function getMyIp(): Promise<string> {

export function getMyIp() {
	/*http.get(options, function (res) {
		var ip = '';
		res.on('data', function (d) {
			ip += d;
		}
		).on('end', function () {
			console.log(ip);
		}
		);
	}
	).on('error', function (e) {
		console.log(e.message);
	}
	);*/
}
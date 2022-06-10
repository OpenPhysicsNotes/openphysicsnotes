
var _hostname = "";
var _port = 0;

export function getHostName() : string {
	if (_hostname) {
		return _hostname;
	}

	_hostname = "localhost";

	if (process.env.HOSTNAME) {
		_hostname = process.env.HOSTNAME;
	}

	return _hostname;
};

export function getPort() : number {
	if (_port) {
		return _port;
	}

	_port = 8080;

	if (process.env.PORT) {
		_port = parseInt(process.env.PORT);
	}

	return _port;
};
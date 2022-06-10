
import http from 'http';
import socket_io from 'socket.io';

export var io : socket_io.Server | null = null;

export function init_io(server: http.Server) {
	io = new socket_io.Server(server);


	io.on('connection', (socket) => {
		console.log(`a user connected, socket.id=${socket.id}, user ip=${socket.conn.remoteAddress}`);
		//console.log(socket.client);
	});
}
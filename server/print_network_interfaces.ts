

import { networkInterfaces } from 'os';

function printInterfaces() {
	let nets = networkInterfaces();

	for (let name in nets) {
		let iface = nets[name];
		for (let i = 0; i < iface.length; i++) {
			let alias = iface[i];
			console.log(name + ": " + alias.address + ' ' + alias.family + ' ' + alias.internal);
		}
	}
}

printInterfaces();
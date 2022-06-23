

// alternative to consider: https://www.npmjs.com/package/sleep-promise

export function sleepMs(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function sleepSec(sec: number) {
	return sleepMs(sec * 1000);
}
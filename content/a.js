// ELIMINA!

/**
 * @type {HTMLIFrameElement | null}
 */
let iframe = document.getElementById('bubble-iframe');


iframe.onload = () => {
	/**
	 * @type {HTMLCanvasElement | null}
	 */
	let canvas = iframe.contentWindow.document.getElementById("canvas");
	if (canvas) {
		let ratio = canvas.width / canvas.height;
		
		// 100% width, keep ratio
		canvas.style.width = "100%";
		canvas.style.aspectRatio = ratio;
	}
}
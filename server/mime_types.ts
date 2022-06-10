
export var image_mime_types = {
	"jpg": "image/jpeg",
	"jpeg": "image/jpeg",
	"png": "image/png",
	"gif": "image/gif",
	"svg": "image/svg+xml",
	"ico": "image/x-icon",
	"bmp": "image/bmp",
	"webp": "image/webp",
	"tiff": "image/tiff",
	"tif": "image/tiff",
	"jfif": "image/jpeg",
	"jpe": "image/jpeg",
	"jpx": "image/jpeg",
	"j2k": "image/jpeg",
	"jp2": "image/jpeg",
	"j2c": "image/jpeg",
	"jpc": "image/jpeg",
}

export var javascript_mime_types = {
	"js": "application/javascript",
	"mjs": "application/javascript",
	"ts": "application/javascript",
	"tsx": "application/javascript",
}

export var text_mime_types = {
	"html": "text/html",
	"htm": "text/html",
	"shtml": "text/html",
	"xhtml": "text/html",
	"xml": "text/xml",
	"xsl": "text/xml",
	"xslt": "text/xml",
	"xsd": "text/xml",
	"xslth": "text/xml",
	"xht": "text/xml",
	"xhtm": "text/xml",
	"md" : "text/plain",
	"txt": "text/plain",
}

export var css_mime_types = {
	"css": "text/css",
	"less": "text/css",
	"scss": "text/css",
	"sass": "text/css",
	"styl": "text/css",
	"stylus": "text/css",
}

export var font_mime_types = {
	"woff": "font/woff",
	"woff2": "font/woff2",
	"ttf": "font/ttf",
	"otf": "font/otf",
	"eot": "font/eot",
}


export var default_mime_types : { [data : string] : string } = {
	...image_mime_types,
	...javascript_mime_types,
	...text_mime_types,
	...css_mime_types,
	...font_mime_types,
}
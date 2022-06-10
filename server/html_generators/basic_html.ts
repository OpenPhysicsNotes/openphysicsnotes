
import logger from '../logger';
import { default_mime_types } from '../mime_types';

export class BasicHtml5Page {

	/**
	 * The title of the page
	 */
	title : string = "Title";

	/**
	 * @see https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Writing_style_guide#choosing_titles_and_slugs
	 * @see https://developer.mozilla.org/en-US/docs/Glossary/Slug
	 * @see https://www.w3.org/International/articles/language-tags/
	 */
	slug: string = "";

	/**
	 * Additional content to be added to the head section of the html page
	 */
	additional_head_content : string = "";

	/**
	 * Document language, defaults to en.
	 * Set to "" to disable
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
	 */
	language : string = "en";

	/**
	 * The document charset, defaults to utf-8.
	 * Set to "" to disable
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/charset
	 */
	charset : string = "utf-8"; // or UTF-8 ?

	/**
	 * Additional meta tags to be added to the head section of the html page
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
	 */
	meta : { [name : string] : string } = {
		"description": "",
		"author": "",
		"keywords": "",
		"page-subject": "",
	};

	/**
	 * Stylesheets paths to be added to the page
	 */
	styleSheets : ({ src?: string, css?: string, atEndOfBody?: boolean } | string)[] = [];
	
	/**
	 * Fonts paths to be added to the page
	 */
	fonts : string[] = [];

	/**
	 * Scripts path to be added to the page, example:
	 * ```
	 * let page = new BasicHtml5Page();
	 * page.scripts.push("/some/script.js");
	 * page.scripts.push({
	 *     src: "/some/other/script.js",
	 *     async: true
	 * });
	 * page.scripts.push({
	 *     src: "/some/other/script.mjs",
	 *     async: true,
	 *     type: "module"
	 * });
	 * ```
	 */
	scripts : ({ src?: string, async?: boolean, type?: string, code?: string } | string)[] = [];

	/**
	 * A different favicon can be specified by setting the favicon property.
	 * Seto to "" to disable and use the default favicon.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/Icon
	 */
	favicon : string = "";

	/**
	 * The content of the page
	 */
	body_content : string = "";

	get body() : string {
		return this.body_content;
	}

	/**
	 * Returns the generated html page as a string
	 */
	get html() : string {
		return `<!DOCTYPE html>
<html${(this.language) ? ' lang="' + this.language + '"' : ''}>
<head>
    ${this._indent(this._meta_tags(), 1, true)}
    ${this._indent(this._favicon_tag, 1, true)}
    ${this._title_tag}
    ${this._indent(this._style_tags(), 1, true)}
    ${this._indent(this._font_tags, 1, true)}
    ${this._indent(this._script_tags, 1, true)}
    ${this._indent(this.additional_head_content, 1, true)}
</head>
<body>

${this.body}

${this._style_tags(true)}
</body>
</html>
`;
	}

	private _meta_tags() : string {
		let tags = [];

		// charset
		if (this.charset) {
			tags.push(`<meta charset="${this.charset}">`);
		}

		tags.push(`<meta http-equiv="X-UA-Compatible" content="IE=edge">`);

		tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);

		for (let name in this.meta) {
			let content = this.meta[name];
			if (content) {
				tags.push(this.make_meta_tags(name, content));
			}
		}

		return tags.join("\n");
	}

	private make_meta_tags(name : string, content : string) : string {
		return `<meta name="${name}" content="${content}">`;
	}

	private _indent(str : string, n : number, skipFirstLine : boolean = false) : string {
		
		let result = str.split("\n").map((line, i) => {
			if (skipFirstLine && i == 0) {
				return line;
			}
			return "    ".repeat(n) + line;
		}).join("\n");

		return result;

		//return str.split("\n").map(line => " ".repeat(n) + line).join("\n");
	}

	private get _title_tag() : string {
		let title = this.title;
		if (!title) {
			title = this.slug;
		}
		if (!title) {
			title = "<<NO TITLE>>";
		}

		return `<title>${title}</title>`;
	}

	private _style_tags(atEndOfBody : boolean = false) : string {
		let tags = [];
		for (let styleSheet of this.styleSheets) {
			if (typeof styleSheet == "string") {
				tags.push(`<link rel="stylesheet" href="${styleSheet}">`);
			} else {
				if (atEndOfBody == (styleSheet.atEndOfBody ? true : false)) {
					if (styleSheet.src) {
						tags.push(`<link rel="stylesheet" href="${styleSheet.src}">`);
					} else if (styleSheet.css) {
						tags.push(`<style>${styleSheet.css}</style>`);
					} else {
						logger.error("Invalid styleSheet object");
					}
				}
			}
		}
		return tags.join("\n");
	}

	private get _script_tags() : string {
		let tags = [];
		for (let script of this.scripts) {
			if (typeof script == "string") {
				tags.push(`<script src="${script}"></script>`);
			} else {
				tags.push(`<script${(script.async) ? ' async' : ''}${(script.type) ? ` type="${script.type}"` : ''}${script.src ? ' src="' + script.src + '"' : ""}>${script.code ? script.code : ""}</script>`);
			}
		}
		return tags.join("\n");
	}

	private get _favicon_tag() : string {
		if (!this.favicon) {
			return "";
		}

		// get favicon extension
		let ext = this.favicon.split(".").pop();

		let mime_type = default_mime_types[ext];

		if (!mime_type) {
			return `<!-- Warning, favicon "${this.favicon}" as no recognized mime tyoe -->
<link rel="shortcut icon" href="${this.favicon}"">`;
		}

		return `<link rel="shortcut icon" href="${this.favicon}" type="${mime_type}">`;
	}

	private get _font_tags() : string {
		let tags = [];
		for (let font of this.fonts) {
			tags.push(`<link rel="stylesheet" href="${font}">`);
		}
		return tags.join("\n");
	}
}
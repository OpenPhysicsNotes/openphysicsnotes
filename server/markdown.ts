

import MarkdownIT from "markdown-it"

import footnotes from "markdown-it-footnote"
import tex_math from './markdown-it-math'
import notes from './markdown-it-note'
import include from 'markdown-it-include'
import emoji from 'markdown-it-emoji'
import sup from 'markdown-it-sup'

import type StateCore from "markdown-it/lib/rules_core/state_core"

import yaml from 'js-yaml'


class ProcessedMarkdown {
	meta : {
		[data : string] : any
	} = {};

	html : string = "";
}

class Markdown2Html {

	md : MarkdownIT

	constructor() {
		this.md = new MarkdownIT({
			html: true,
			linkify: true,
			typographer: true
		});
		
		
		this.md.use(footnotes);
		
		this.md.use(tex_math);

		this.md.use(notes);

		// creashes if file is not found
		//this.md.use(include, {
		//	// TODO use the current link
		//	root: "./content"
		//});
		
		this.md.use(emoji);
		this.md.use(sup);
	}

	get markdownIt() : MarkdownIT {
		return this.md;
	}

	process(markdown : string) : ProcessedMarkdown {
		let result = new ProcessedMarkdown();

		if (markdown.startsWith("---")) {
			let yamlEnd = markdown.indexOf("---", 4);
			if (yamlEnd !== -1) {
				let yamlStr = markdown.substring(4, yamlEnd);
				result.meta = yaml.load(yamlStr) || {};
				markdown = markdown.substring(yamlEnd + 4);
			}
		}

		result.html = this.md.render(markdown);

		return result;
	}
}

export default Markdown2Html;
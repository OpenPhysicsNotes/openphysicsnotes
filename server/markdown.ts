

import MarkdownIT from "markdown-it"

import footnotes from "markdown-it-footnote"
import tex_math from './markdown_plugins/markdown-it-math'
import notes from './markdown_plugins/markdown-it-note'
import include from 'markdown-it-include'
import emoji from 'markdown-it-emoji'
import sup from 'markdown-it-sup'
import center from 'markdown-it-center-text'
import anchor from "markdown-it-anchor"

import type StateCore from "markdown-it/lib/rules_core/state_core"

import yaml from 'js-yaml'
import { extractMeta } from "./meta_exctractor"

class Markdown2Html {

	private md : MarkdownIT

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
		this.md.use(center);
		this.md.use(anchor, {
			permalink: anchor.permalink.headerLink(),
			tabindex: false,
		});
	}

	/**
	 * @retuns the "markdown-it" instance
	 */
	get markdownIt() : MarkdownIT {
		return this.md;
	}

	/**
	 * @param markdown the markdon text to process
	 * @returns the processed markdown converted to html representation
	 */
	process(markdown : string) : string {
		return this.md.render(markdown);;
	}
}

export default Markdown2Html;
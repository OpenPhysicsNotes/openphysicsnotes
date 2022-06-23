

// see https://github.com/github/feedback/discussions/16925

// example:
// https://github.com/markdown-it/markdown-it-container/


import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';

import containerPlugin from 'markdown-it-container';
import { attrs_to_string, getAttrs } from './attrs';

function defContainer(md : MarkdownIt, name : string) {
	containerPlugin(md, name, {
		render : (tokens : Token[], idx : number, options : any, env : any, self : any) => {

			if (tokens[idx].nesting === 1) {
				// opening tag
				let token = tokens[idx];

				// TODO remove and do with custom markdown-it-attrs
				if (token.info.indexOf(" {") !== -1) {
					if (token.info.indexOf("}") !== -1) {
						if (!token.attrs) {
							token.attrs = getAttrs(token.info, token.info.indexOf("{")).attrs;
						}
					}
				}

				return `<lc-${name} ${attrs_to_string(token.attrs)}>\n`;
			} else {
				// closing tag
				return `\n</lc-${name}>`;
			}
		}
	})
}

function spoiler_container(md : MarkdownIt, name : string) {

	// see https://github.com/markdown-it/markdown-it-container/blob/adb3defde3a1c56015895b47ce4c6591b8b1e3a2/README.md?plain=1#L59

	const validate_REGEXP = new RegExp(`^${name}(\\s+(.*))?$`);
	const summary_capture_REGEXP = new RegExp(`^${name}\\s+(.*?)($|( {))`);

	containerPlugin(md, name, {
		validate: (params : string) => {
			return params.trim().match(validate_REGEXP);
		},
		render: (tokens : Token[], idx : number, options : any, env : any, self : any) => {
			let token = tokens[idx];

			var m = token.info.trim().match(summary_capture_REGEXP);

			// TODO remove and do with custom markdown-it-attrs
			if (token.info.indexOf(" {") !== -1) {
				if (token.info.indexOf("}") !== -1) {
					if (!token.attrs) {
						token.attrs = getAttrs(token.info, token.info.indexOf("{")).attrs;
					}
				}
			}

			const summary = m ? m[1].trim() : "";

			if (token.nesting === 1) {
				// opening tag
				if (summary || name !== "details") {
					return `<details ${attrs_to_string(token.attrs)}><summary>${summary || name}</summary>\n`;
				}

				return `<details ${attrs_to_string(token.attrs)}>\n`;
			} else {
				// closing tag
				return `\n</details>`;
			}
		}
	});
}

export default function(md : MarkdownIt) {

	defContainer(md, 'note');
	defContainer(md, 'warning');
	defContainer(md, 'todo');
	defContainer(md, 'def');
	defContainer(md, 'solution');

	spoiler_container(md, 'spoiler');
	spoiler_container(md, 'details');
};
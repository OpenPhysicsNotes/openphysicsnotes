

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


export default function(md : MarkdownIt) {

	defContainer(md, 'note');
	defContainer(md, 'warning');
	defContainer(md, 'todo');
	defContainer(md, 'def');
	defContainer(md, 'solution');
};
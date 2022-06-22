
/*
- Author benweet, https://github.com/benweet
- Source https://github.com/benweet/stackedit/blob/master/src/extensions/libs/markdownItMath.js
  (With some minor modifications)
*/

import StateInline from 'markdown-it/lib/rules_inline/state_inline'
import type MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import Renderer from 'markdown-it/lib/renderer';
import { attrs_to_string, getAttrs } from './attrs';

function fix_tex_math_html(src : string) : string {
	src = src.replace("<", "&lt;");
	src = src.replace(">", "&gt;");

	return src;
}

function texMath(state: StateInline, silent : boolean) : boolean {

	let startMathPos = state.pos;

	// we parse if the current character is a $
	if (state.src.at(startMathPos) !== '$') {
		return false;
	}

	// Parse tex math according to http://pandoc.org/README.html#math
	let endMarker = '$';
	startMathPos += 1;
	const afterStartMarker = state.src.at(startMathPos);
	if (afterStartMarker === "$") {
		endMarker = '$$';
		startMathPos += 1;
		if (state.src.at(startMathPos) === "$") {
			// 3 markers are too much
			return false;
		}
	} else if (
		// Skip if opening $ is succeeded by a space character
		afterStartMarker === " "
		|| afterStartMarker === "\t"
		|| afterStartMarker === "\n"
	) {
		return false;
	}

	// find the end of the math
	const endMarkerPos = state.src.indexOf(endMarker, startMathPos);
	if (endMarkerPos === -1) {
		return false;
	}

	// if the end marker is escaped, we continue
	// TODO TO FIX THIS?!?!?!
	if (state.src.charCodeAt(endMarkerPos - 1) === 0x5C /* \ */) {
		return false;
	}

	let nextPos = endMarkerPos + endMarker.length;
	if (endMarker.length === 1) {
		// Skip if $ is preceded by a space character
		const beforeEndMarker = state.src.at(endMarkerPos - 1);
		if (beforeEndMarker === "_"
			|| beforeEndMarker === "\t"
			|| beforeEndMarker === "\n") {
			return false;
		}
		// Skip if closing $ is succeeded by a digit (eg $5 $10 ...)
		const suffix = state.src.charCodeAt(nextPos);
		if (suffix >= 0x30 && suffix < 0x3A) {
			return false;
		}
	}

	let info = "";

	// if it is followed by {...}, add it to info
	const nextChar = state.src.charCodeAt(nextPos);
	if (nextChar === 0x7B /* { */) {
		const endPos = state.src.indexOf("}", nextPos);
		if (endPos !== -1) {
			info = state.src.slice(nextPos, endPos + 1);
			console.log(info);
			nextPos = endPos + 1;
		}
	}

	if (!silent) {
		const token = state.push(endMarker.length === 1 ? 'inline_math' : 'display_math', 'lc-tex-math', 0);
		token.markup = endMarker;
		token.content = state.src.slice(startMathPos, endMarkerPos);

		// looks like a bad combination of
		// markdown-it-attrs and markdown-it-bracketed-spans
		// modifies our content if it ends with "{something}"
		// TODO ISSUE
		// TODO WHY???
		// why inline code is not affected
		token["_tex_content"] = token.content;

		if (info) {
			token.info = info;
		}

		// TODO REMOVE! MOVE INTO A CUSTOM "markdown-it-attrs"
		token.attrs = getAttrs(token.info, 0).attrs;
	}
	state.pos = nextPos;
	return true;
}

export default (md : MarkdownIt) => {
	md.inline.ruler.push('texMath', texMath);
	
	md.renderer.rules["inline_math"] = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) : string => {
		let token = tokens[idx];

		return `<i-math ${attrs_to_string(token.attrs)}>${fix_tex_math_html(token["_tex_content"])}</i-math>`
	};

	md.renderer.rules["display_math"] = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) : string => {
		let token = tokens[idx];
		
		return `<tex-math ${attrs_to_string(token.attrs)}>${fix_tex_math_html(token["_tex_content"])}</tex-math>`
	};
};
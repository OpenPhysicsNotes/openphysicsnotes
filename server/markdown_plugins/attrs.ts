
// adapted from https://github.com/arve0/markdown-it-attrs
// see https://github.com/arve0/markdown-it-attrs/blob/ad79f52d9714eb7e3358689872166b128d334e07/utils.js#L7

interface Options {
	leftDelimiter: string;
	rightDelimiter: string;

	allowedAttributes?: string[];
}

type Attr = [string, string];
type Attrs = Attr[];

interface Result {
	attrs: Attrs;
	end: number;
}

/**
 * parse {.class #id key=val} strings
 * @param str: string to parse
 * @param start: where to start parsing (including `{`)
 * @returns [['key', 'val'], ['class', 'red']]
 */
 export function getAttrs(str : string, start : number, options : Options = { leftDelimiter: '{', rightDelimiter: '}' }) : Result {

	/** not tab, line feed, form feed, space, solidus, greater than sign, quotation mark, apostrophe and equals sign */
	const allowedKeyChars = /[^\t\n\f />"'=]/;

	/** We use space as separator for key/value pairs */
	const pairSeparator = ' ';

	/** The key/value separator */
	const keySeparator = '=';

	/** The character that marks the start of a **class name** */
	const classChar = '.';

	/** The character that marks the start of an **id name** */
	const idChar = '#';
  
	/** The parsed attributes list */
	let attrs : Attrs = [];

	/** The current parsing key */
	let key = '';

	/** the current parsing value */
	let value = '';

	/** true if we are parsing a key */
	let parsingKey = true;

	/** true if we are in a value inside quotes */
	let valueInsideQuotes = false;

	/** the end of the parsed block */
	let end = start + 1;

	/**
	 * Push the current key/value pair to the list of attributes.
	 * Reset the key and value.
	 */
	function push_key_value_pair() {
		if (key.length > 0) {
			attrs.push([key, value]);
		}

		key = '';
		value = '';
	}

	// read inside `{...}`
	// (start + left delimiter length) to avoid beginning "{"
	// breaks when "}" is found or end of string
	for (let i = start + options.leftDelimiter.length; i < str.length; i++) {
		end = i;

		// stop when right delimiter is found
		if (str.slice(i, i + options.rightDelimiter.length) === options.rightDelimiter) {

			// if we were parsing a key, we need to add the last key/value pair before exiting
			push_key_value_pair();
			break;
		}

		/**
		 * The current character
		 */
		const char_ = str.charAt(i);

		// switch to reading value if equal sign
		if (char_ === keySeparator && parsingKey) {
			parsingKey = false;
			continue;
		}

		// {.class} {..css-module}
		// TODO ???
		if (char_ === classChar && key === '') {
			if (str.charAt(i + 1) === classChar) {
			key = 'css-module';
			i += 1;
			} else {
			key = 'class';
			}
			parsingKey = false;
			continue;
		}

		// {#id}
		if (char_ === idChar && key === '') {
			key = 'id';
			parsingKey = false;
			continue;
		}
  
		// {value="inside quotes"}
		if (char_ === '"' && value === '') {
			valueInsideQuotes = true;
			continue;
		}
		if (char_ === '"' && valueInsideQuotes) {
			valueInsideQuotes = false;
			continue;
		}
  
		// read next key/value pair
		if ((char_ === pairSeparator && !valueInsideQuotes)) {
			if (key === '') {
			// beginning or ending space: { .red } vs {.red}
			continue;
			}
			attrs.push([key, value]);
			key = '';
			value = '';
			parsingKey = true;
			continue;
		}
  
		// continue if character not allowed
		if (parsingKey && char_.search(allowedKeyChars) === -1) {
			continue;
		}
  
		// no other conditions met; append to key/value
		if (parsingKey) {
			key += char_;
			continue;
		}

		value += char_;
	}

	if (options.allowedAttributes && options.allowedAttributes.length > 0) {
		// remove all attributes not in allowedAttributes
		Object.keys(attrs).forEach(key => {
			if (!options.allowedAttributes.includes(key)) {
				delete attrs[key];
			}
		});
	}

	return { attrs, end: end };
};

export function attrs_to_string(attrs : Attrs | null) : string {
	if (!attrs) { return ''; }

	// we transform the list into a map to avoid duplicates
	// the 'class' key is special, multiple classes are merged into one
	let attrs_map : { [name : string] : string } = {};
	attrs.forEach(([key, value]) => {
		// classes will be joined with ' '
		if (key === 'class') {
			// if class is already set, add to it
			// otherwise set it
			if (attrs_map.class) {
				attrs_map.class += ' ' + value;
			} else {
				attrs_map.class = value;
			}
			return;
		}

		// any other key will be overwritten
		attrs_map[key] = value;
	});

	return Object.keys(attrs_map).map(key => {
		const value = attrs_map[key];
		if (value) {
			return `${key}="${attrs_map[key]}"`;
		}

		return key;
	}).join(' ');
}
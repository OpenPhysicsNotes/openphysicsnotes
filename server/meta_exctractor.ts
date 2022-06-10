
import yaml from 'js-yaml';

import logger from './logger';

export interface SeparatedContent {
	/**
	 * The parsed yaml data
	 */
	meta? : {
		[data : string] : any
	};

	/**
	 * The rest of the file
	 */
	content : string;
}

export function extractMeta(textFileContent : string, separator = "---") {

	let result : SeparatedContent = {
		content : ""
	};

	let lines = textFileContent.split("\n");
	
	if (lines[0].startsWith(separator)) {
		let yaml_content = "";

		// find the end of the yaml
		let yaml_end_index = lines.slice(1).findIndex(line => line.startsWith(separator));
		
		// if we found the end of the yaml
		if (yaml_end_index != -1) {
			// get the yaml lines
			yaml_content = lines.slice(1, yaml_end_index + 1).join("\n");

			// get the rest of the lines
			result.content = lines.slice(yaml_end_index + 2).join("\n");

			// parse the yaml
			try {
				result.meta = yaml.load(yaml_content);
				//logger.info(`yaml parsed: ${yaml.dump(result.meta)}, from ${yaml_content}`);
			} catch (e) {
				logger.error(`Error parsing yaml: ${e}`);
			}
			result.meta = yaml.load(yaml_content);

			return result
		}
	}

	// no yaml
	result.content = textFileContent;

	return result;
}
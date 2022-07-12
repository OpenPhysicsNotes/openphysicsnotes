
import { FolderItem, FolderItemType } from "./lib/FolderItem";

export const imgages_ext_to_friendly_name : { [name : string] : string } = {
	'png': 'PNG Image',
	'jpg': 'JPEG Image',
	'jpeg': 'JPEG Image',
	'gif': 'GIF Image',
}

export const archives_ext_to_friendly_name : { [name : string] : string } = {
	'zip': 'ZIP Archive',
	'rar': 'RAR Archive',
	'7z': '7Z Archive',
}

export const videos_ext_to_friendly_name : { [name : string] : string } = {
	'mp4': 'MP4 Video',
	'mov': 'MOV Video',
	'avi': 'AVI Video',
	'wmv': 'WMV Video',
	'flv': 'FLV Video',
	'mkv': 'MKV Video',
}

export const audios_ext_to_friendly_name : { [name : string] : string } = {
	'mp3': 'MP3 Audio',
	'ogg': 'OGG Audio',
	'wav': 'WAV Audio',
	'mp2': 'MP2 Audio',
}

export const ext_to_friendly_name : { [name : string] : string } = {
	'html': 'HTML',
	'css': 'Style Sheet',
	'js': 'JavaScript File',
	'json': 'JSON File',
	'pdf': 'PDF Document',
	'txt': 'Text File',
	...imgages_ext_to_friendly_name,
	...archives_ext_to_friendly_name,
	...videos_ext_to_friendly_name,
	...audios_ext_to_friendly_name,
}

export function ext2FileTypeFriendlyName(ext : string) : string {

	ext = ext.toLocaleLowerCase();

	if (ext in ext_to_friendly_name) {
		return ext_to_friendly_name[ext];
	}

	return "unknown file";
}

export function toFileTypeFriendlyName(item : FolderItem) {
	if (item.type === FolderItemType.Folder) {
		return "Folder";
	}

	let splitted = item.name.split('.');

	if (splitted.length <= 1) {
		return "unknown file";
	}

	let ext = splitted.pop();

	if (ext) {
		return ext2FileTypeFriendlyName(ext);
	}

	return "???";
}

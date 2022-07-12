
import { FolderItemType } from '../lib/FolderItem'

function isVideoFileExtension(ext: string) {
	return ext === 'mp4' || ext === 'mov' || ext === 'avi' || ext === 'wmv' || ext === 'flv' || ext === 'ogg' || ext === 'wav' || ext === 'mkv';
}

function isTextFileExtension(ext: string) {
	return ext === 'txt' || ext === 'md';
}

function isImageFileExtension(ext: string) {
	return ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif';
}

function isCodeFileExtension(ext: string) {
	return ext === 'js' || ext === 'css' || ext === 'html' || ext === 'json';
}

function isCompressedFileExtension(ext: string) {
	return ext === 'zip' || ext === 'rar' || ext === '7z';
}

function itemTypeToIconName(itemType: FolderItemType, itemName: string) {
	switch (itemType) {
		case FolderItemType.Folder:
			return 'folder';
		case FolderItemType.File:
			if (itemName.split('.').length > 1) {
				let fileExtension = itemName.split('.').pop();

				if (fileExtension) {
					if (isVideoFileExtension(fileExtension)) {
						return 'movie';
					}
					if (isTextFileExtension(fileExtension)) {
						return 'text_snippet';
					}
					if (isImageFileExtension(fileExtension)) {
						return 'image';
					}
					if (isCodeFileExtension(fileExtension)) {
						return 'code';
					}
					if (isCompressedFileExtension(fileExtension)) {
						return 'compress';
					}
				}
			}
			return 'draft';
	}
}

function itemTypeToIconSpan(itemType: FolderItemType, itemName: string) {
	return <span className="material-symbols-outlined">{itemTypeToIconName(itemType, itemName)}</span>;
}

export function TypeIcon(props : {
	itemType: FolderItemType;
	itemName?: string;
}) {
	if (!props.itemName) {
		props.itemName = "";
	}

	return itemTypeToIconSpan(props.itemType, props.itemName);
}

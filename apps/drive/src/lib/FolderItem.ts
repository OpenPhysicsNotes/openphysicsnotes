


export enum FolderItemType {
	None = 0,
	Folder = 'Folder',
	File = 'File',
}

export interface FolderItem {
	name: string;

	complete_path?: string;

	type : FolderItemType;
}

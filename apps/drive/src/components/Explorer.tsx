

import e from 'express';
import React, { useEffect, useState } from 'react';
import { FolderItem, FolderItemType } from '../lib/FolderItem';
import { RemoteWorkspace } from '../lib/RemoteWorkspace';

import { toFileTypeFriendlyName } from '../file_types'

import { TypeIcon } from './FileIcon';

import { ProgressBar } from './ProgressBar';

import path from 'path-browserify'

import async from 'async';

import './Explorer.css';

import { API_HOST } from '../api_host';

const tmp_base_get_url = API_HOST + "drive/blob/now/";
const MAKE_DIR_PROMPT_TEXT = `Enter the name of the new folder\nuse \"<folder 1>/<folder 2>/...\" for recursive folder creation`;
console.log(tmp_base_get_url);

function PathNavElement(props: {
	name: string;
	onclick?: () => void;
}) {

	return (
		<div className="path-nav-element" onClick={props.onclick}>
			{props.name}
		</div>
	);
}

export function PathNavigator(props: {
	path: string;
	changePath?: (path: string) => void;
	makeDir?: (relativePath: string) => void;
}) {

	let splitPath = props.path.split('/');

	let pathNavElements : JSX.Element[] = [];

	pathNavElements.push(<PathNavElement name={"home"} onclick={
		() => {
			if (props.changePath) {
				props.changePath("");
			}
		}
	} />);
	pathNavElements.push(<div className="path-nav-separator">/</div>);

	for (let i = 0; i < splitPath.length; i++) {

		if (!splitPath[i]) {
			continue;
		}

		let pathNavElement = <PathNavElement name={splitPath[i]} onclick={
			() => {
				if (props.changePath) {
					props.changePath(splitPath.slice(0, i + 1).join('/'));
				}
			}
		} />;

		pathNavElements.push(pathNavElement);
		pathNavElements.push(<div className="path-nav-separator">/</div>);
	}

	pathNavElements.push(<button onClick={() => {
		let newFolderName = prompt(MAKE_DIR_PROMPT_TEXT)
		if (newFolderName) {
			props.makeDir?.(newFolderName);
		}
	}}>new Folder</button>);

	return (
		<div className='app-path-navigator'>
			{pathNavElements}
		</div>
	);
}

function ExplorerTopBar(props : {
	path: string;
	changePath?: (path: string) => void;
	makeDir?: (relativePath: string) => void;
}) {
	return (
		<div className='app-explorer-top-bar'>
			<PathNavigator path={props.path} changePath={props.changePath} makeDir={props.makeDir}/>
			ciao
		</div>
	);
}



export interface Item extends FolderItem {
	onClick?: () => void;
	onDoubleClick?: () => void;
	selected?: boolean;
}

class ExplorerItemRow extends React.Component<{
	item: Item;
}, {
	isSelected: boolean;
}> {
	constructor(props: {
		item: Item;
	}) {
		super(props);

		this.state = {
			isSelected: props.item.selected || false,
		};

		this.onClick = this.onClick.bind(this);
	}

	onClick(e : React.MouseEvent) {

		// e.detail is the number of clicks!!!!!

		if (this.props.item.onClick) {
			this.props.item.onClick();
		}

		// if key ctrl is pressed, select the item
		if (e.ctrlKey) {
			let selected = !this.state.isSelected
			this.setState({
				isSelected: selected,
			});
			this.props.item.selected = selected;
		}

		if (e.detail === 2) {
			if (this.props.item.onDoubleClick) {
				this.props.item.onDoubleClick();
			}
		}

		/*setTimeout(() => {
			this.setState({
				isSelected: false,
			});
		}
		, 500);*/
	}

	render() {
		return (
			<tr className={'app-explorer-item-row ' + (this.state.isSelected ? 'selected' : '')} onClick={this.onClick}>
				{/*<td><img src="/logo192.png" alt="ICON" className='app-explorer-item-icon'/></td>*/}
				<td><TypeIcon itemType={this.props.item.type} itemName={this.props.item.name} /></td>
				<td className='app-explorer-table-name-column'>{this.props.item.name}</td>
				<td className='app-explorer-table-type-column'>{toFileTypeFriendlyName(this.props.item)}</td>
			</tr>
		);
	}
};

function ExplorerTableImpl(props: {
	items: Item[];
}) {
	return (
		<table className='app-explorer-table'>
			<thead>
				<tr>
					<th>{/* ICON */}</th>
					<th className='app-explorer-table-name-column'>Name</th>
					<th className='app-explorer-table-type-column'>Type</th>
					<th>Last edit</th>
				</tr>
			</thead>
			<tbody>
				{props.items.map((item, index) => {
					return <ExplorerItemRow item={item}/>
				}
				)}
			</tbody>
		</table>
	);
}

function DndOverlay(props: {
	isDragging: boolean;
}) {
	return (
		<div className={'app-explorer-dnd-overlay ' + (props.isDragging ? 'visible' : '')}>
			<div className='app-explorer-dnd-overlay-content'>
				<div className='app-explorer-dnd-overlay-content-text'>
					<div className='app-explorer-dnd-overlay-content-text-icon'>
						<span className="material-symbols-outlined" style={{fontSize:"400%"}}>folder</span>
					</div>
					<div className='app-explorer-dnd-overlay-content-text-text'>
						<div className='app-explorer-dnd-overlay-content-text-text-title'>
							Drop here
						</div>
						<div className='app-explorer-dnd-overlay-content-text-text-subtitle'>
							Drag and drop files or folders here
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// !!! REMOVE
let curr_path = "";

class ExplorerTable extends React.Component<{
	items: ItemList;
	path : string;
	onSingleUploadTerminated? : () => void;
	deleteItems? : (items: Item[]) => void;
}, {
	isDragging: boolean;
	progresses: number[];
}> {

	constructor(props: {
		items: ItemList;
		path : string;
		onSingleUploadTerminated? : () => void;
	}) {
		super(props);

		this.state = {
			isDragging: false,
			progresses: [],
		};

	}

	onDragEnter(e: React.DragEvent) {

		console.log("drag enter");

		this.setState({
			isDragging: true,
		});

		e.preventDefault();
		e.stopPropagation();
	}

	onDragOver(e : React.DragEvent) {

		e.preventDefault();
		e.stopPropagation();
	}

	onDragExit(e : React.DragEvent) {
		this.setState({
			isDragging: false,
		});

		e.preventDefault();
		e.stopPropagation();
	}

	onkeydown(e : React.KeyboardEvent) {
		// delete
		if (e.key === "Delete") {
			if (this.props.items instanceof Array) {
				let selected = this.props.items.filter((item) => item.selected);
				console.log("selected", selected);

				if (selected.length > 0) {
					if (this.props.deleteItems) {
						let confirmed = window.confirm("Are you sure you want to delete " + selected.length + ` item${selected.length > 1 ? 's' : ''}?`);
						if (confirmed) {
							this.props.deleteItems?.(selected);
						}
					}
				}
			}
		}
	}

	onDrop(e : React.DragEvent) {

		this.setState({
			isDragging: false,
		});

		console.log("drop", e.dataTransfer.files);
		console.log("drop", e.dataTransfer.types);
		console.log("drop", e.dataTransfer.items);
		console.log("drop", e.dataTransfer.items[0].webkitGetAsEntry());

		this.setState({
			progresses: [],
		});
		let newProgresses : number[] = [];

		let queue = async.queue((task, completed) => {
			console.log("QUEUE", task, completed);

			(task as any)(completed);

			//completed(null);
		}, 1);// if > 1, not updated whell... race condition
		queue.pause();

		let uploadFile = (file : FileSystemFileEntry, rootPath : string) => {

			// copilot:
			// TODO study FileReader
			//let reader = new FileReader();

			const relativeDirName = path.dirname(file.fullPath).replace(/\\/g, "/");
			const dirName = path.join(rootPath, relativeDirName).replace(/\\/g, "/");

			// send the file to the server
			let req = new XMLHttpRequest();
			//let formData = new FormData();
			//formData.append("file", file);

			let params = new URLSearchParams({
				dir: dirName,
				file : file.name
			});

			let i = newProgresses.length;
			newProgresses.push(10);
			this.setState({
				progresses: newProgresses,
			});
			console.log("progress", i, newProgresses, file.name);

			req.open("POST", API_HOST + "api/drive/upload?" + params.toString(), true);
			console.log(API_HOST + "api/drive/upload?" + params.toString());

			req.upload.onprogress = (e) => {
				console.log("up progress", e.loaded / e.total, e.loaded, e.total);
				this.setState({
					progresses: this.state.progresses.map((p, index) => {
						if (index === i) {
							return e.loaded / e.total * 100;
						}
						return p;
						})
				});
			}
			req.upload.addEventListener('load', (e) => {
				// When the request has *successfully* completed.
				// Even if the server hasn't responded that it finished.
				console.log("loaded 2");
				this.setState({
					progresses: this.state.progresses.map((p, index) => {
						if (index === i) {
							return 100;
						}
						return p;
						})
				});
				this.props.onSingleUploadTerminated?.();
			});

			let upload_impl = (completed : () => void) => {
				console.log("uploading QUEUE", file.name);

				req.onload = () => {
					console.log("loaded");
					completed();
				}
				req.onerror = () => {
					console.log("error");
					completed();
				}

				file.file((file) => {
					req.send(file);
				});
			}
			queue.push(upload_impl);
			console.log("queue", queue.length());
		}

		const uploadFolder = (folder: FileSystemDirectoryEntry, rootPath: string) => {

			console.assert(folder instanceof FileSystemDirectoryEntry);

			const reader = folder.createReader();

			reader.readEntries((entries) => {
				console.log("read entries", entries);
				for (let i = 0; i < entries.length; i++) {
					let entry = entries[i];
					if (entry instanceof FileSystemDirectoryEntry) {
						console.log("folder read:", entry.fullPath);
					} else if (entry instanceof FileSystemFileEntry) {
						console.log("file read:", entry.fullPath);
					}
					upload(entry, rootPath);
				}
			});

			/*
			console.log("upload folder", folder, relativePath);
			let reader = new FileReader();
			reader.onload = (e) => {
				let data = e.target!.result;// TODO remove !
				let items = JSON.parse(data as string); // TODO remove as string
				console.log("items", items);
				for (let i = 0; i < items.length; i++) {
					let item = items[i];
					if (item.type === "file") {
						uploadFile(item.file, path.join(relativePath, item.name));
					} else if (item.type === "folder") {
						uploadFolder(item.folder, path.join(relativePath, item.name));
					}
				}
			}
			reader.readAsText(folder);
			*/
		}

		const upload = (entry : FileSystemEntry, rootPath : string) => {

			// TODO gitignore and similar

			if (entry instanceof FileSystemDirectoryEntry) {
				uploadFolder(entry, rootPath);
			} else if (entry instanceof FileSystemFileEntry) {
				uploadFile(entry, rootPath);
			}
		}

		function isDir(item : DataTransferItem) : boolean {
			let entry = item.webkitGetAsEntry();
			if (!entry) {
				// error
				throw new Error("no entry");
			}

			return entry.isDirectory;
		}

		function isFile(item : DataTransferItem) : boolean {
			let entry = item.webkitGetAsEntry();
			if (!entry) {
				// error
				throw new Error("no entry");
			}

			return !entry.isDirectory;
		}
		
		console.log("drop", e.dataTransfer.types);
		for (let i = 0; i < e.dataTransfer.items.length; i++) {
			let item = e.dataTransfer.items[i];
			let entry = item.webkitGetAsEntry();
			if (!entry) {
				// error
				throw new Error("no entry");
			}
			upload(entry, this.props.path);
		}

		// !!!
		setTimeout(() => {
			queue.resume();
		}, 500);

		e.preventDefault();
		e.stopPropagation();
	}

	private hasProgressesAllFinished() {
		if (this.state.progresses.length === 0) {
			return false;
		}

		for (let i = 0; i < this.state.progresses.length; i++) {
			if (this.state.progresses[i] < 100) {
				return false;
			}
		}
		
		return true;
	}


	render() {

		if (this.hasProgressesAllFinished()) {
			this.setState({
				progresses: [],
			});
		}

		return (
			<div className='app-explorer-table-container'
				onDragEnter={this.onDragEnter.bind(this)}
				onDragOver={this.onDragOver.bind(this)}
				onDragExit={this.onDragExit.bind(this)}
				onDrop={this.onDrop.bind(this)}
				onKeyDown={this.onkeydown.bind(this)}
				tabIndex={1}
				>
				{ this.state.progresses.map((p, index) => {
					return <ProgressBar progress={p} key={index}/>;
					})
				}
				{
					this.props.items instanceof Array ?
						// if it's an array, it's a list of items, so render them in a table
						<ExplorerTableImpl items={this.props.items}/>
						:
						this.props.items === 'loading' ?
							// if loading, show a loading spinner in the middle of the explorer
							<div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>
								<div className='app-explorer-loading' style={{fontSize:'150%'}}>
									<div className='app-explorer-loading-spinner'></div>
								</div>
							</div>
							:
							// if error, show an error message in the middle of the explorer
							<div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>
								<div className='app-explorer-error'>
									<div className='app-explorer-error-text' style={{textAlign:'center'}}>
										<span style={{fontSize:'150%'}}>Error loading directory</span><br/>
										maybe the folder does not exists
									</div>
								</div>
							</div>
				}
				<DndOverlay isDragging={this.state.isDragging}/>
			</div>
		);
	}
}

export type ItemList = Item[] | 'loading' | 'error';

export class Explorer extends React.Component<{
	path: string;
	workspace: RemoteWorkspace;
	changePath?: (path: string) => void;
}, {
	items: ItemList;
}> {

	private last_path : string | null = null;

	constructor(props: {
		path: string;
		workspace: RemoteWorkspace;
		changePath?: (path: string) => void;
	}) {
		super(props);

		this.state = {
			items: 'loading',
		};
	}

	componentDidMount() {
		this.updateView();
	}

	/**
	 * Add click event listener to the given item.
	 * @param item the item to be modified
	 * @param parent the parent path of the item
	 */
	private addClickListener(item: Item, parent : string) {

		if (item.type === FolderItemType.Folder) {
			// change path when double click on folder
			item.onDoubleClick = () => {
				if (this.props.changePath) {
					this.props.changePath(path.join(parent, item.name));
				}
			}
		}

		if (item.type === FolderItemType.File) {
			// open file when double click on file
			item.onDoubleClick = () => {

				let file_path = path.join(parent, item.name);

				let url = new URL(tmp_base_get_url + file_path);

				console.log(file_path, url.href);

				let link = document.createElement('a');
				link.href = url.href;
				link.download = item.name;
				link.target = '_blank';
				link.click();
			}
		}
	}

	private updateView() {
		
		const path = this.props.path;

		let ws = this.props.workspace;

		this.setState({
			items: 'loading',
		});

		ws.listDirAsync(path).then((items) => {
			// make a copy of the items, adding click handlers
			let items2 = items.map((item) => {

				// we need to make a copy of the item, otherwise the reference is shared
				let newItem : Item = {...item, selected: false};

				this.addClickListener(newItem, path);

				return newItem;
			});

			this.setState({
				items: items2,
			});
		}
		).catch((err) => {
			this.setState({
				items: 'error',
			});
		}
		);
	}

	deleteItems(items: Item[]) {
		let promises = items.map((item) => {
			return this.props.workspace.deleteAsync(item.complete_path ? item.complete_path : this.props.path +  item.name);
		});

		Promise.all(promises).then((successes) => {
			console.log(successes);
			this.updateView();
		}).catch((err) => {
			console.log("while deleting, err:", err);
			this.updateView();
		});
	}

	makeDir(relativePath : string) {
		if (!this.props.workspace) {
			window.alert("Unable to create directory");
			return;
		}
		this.props.workspace?.makeDir(path.join(this.props.path, relativePath)).then(()=> {
			this.updateView();
		})
	}

	render() {

		// if the path changed, update the view
		if (this.last_path !== this.props.path) {
			this.last_path = this.props.path;
			this.updateView();
		}

		const deleteItems = this.deleteItems.bind(this);
		const makeDir = this.makeDir.bind(this);
		let updateView = this.updateView.bind(this);


		return (
			<div className='app-explorer'>
				<div className='app-left-item'>
					left
				</div>
				<div className='app-explorer-content'>
					<ExplorerTopBar
						path={this.props.path}
						changePath={this.props.changePath}
						makeDir={makeDir}
					/>
					<div className='app-explorer-content-display'>
						<ExplorerTable
							items={this.state.items}
							path={this.props.path}
							onSingleUploadTerminated={updateView}
							deleteItems={(items) =>
							{console.log("delete", items);
							deleteItems(items)}}
						/>
					</div>
				</div>
			</div>
		);
	}

}

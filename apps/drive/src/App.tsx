import React from 'react';
import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { useAuth0 } from "@auth0/auth0-react";

import { Header } from './components/Header';
import { Explorer, Item } from './components/Explorer';
import { OPNRemoteWorkspace } from './lib/RemoteWorkspace';
import { FolderItem, FolderItemType } from './lib/FolderItem';

const tmp_base_get_url = "http://localhost:8080/drive/blob/now/";
const tmp_url = "http://localhost:8080/api/drive/fs/list_dir";

const TMP : { [path : string] : Item[] } = {
	'': [
		{
			type: FolderItemType.Folder,
			name: 'pippo',
		},
		{
			type: FolderItemType.File,
			name: 'pluto.jpg',
		}
	],
	'pippo': [
		{
			type: FolderItemType.Folder,
			name: 'Hello',
		},
		{
			type: FolderItemType.File,
			name: 'There.txt',
		}
	],
}

function App() {

	let workspace = new OPNRemoteWorkspace("opn-ws");

	const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  	const [userMetadata, setUserMetadata] = useState<any>(null);

	useEffect(() => {
		const getUserMetadata = async () => {
		  const domain = "dev-loykkjlu.us.auth0.com";
	  
		  try {
			const accessToken = await getAccessTokenSilently({
			  audience: `https://${domain}/api/v2/`,
			  scope: "read:current_user",
			});

			console.log("accessToken:", accessToken);
	  
			const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user!.sub}`;
	  
			const metadataResponse = await fetch(userDetailsByIdUrl, {
			  headers: {
				Authorization: `Bearer ${accessToken}`,
			  },
			});
	  
			const { user_metadata } = await metadataResponse.json();
	  
			setUserMetadata(user_metadata);
		  } catch (e : any) {
			console.log(e.message);
		  }
		};

		getUserMetadata();
	});

	let [path, setPath] = React.useState('ciao/a/tutti');

	let onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		//e.dataTransfer.setData('text/plain', 'drag'); ????
		e.stopPropagation();
		e.preventDefault();

		return false;
	}

	let onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		return false;
	}

	let onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		return false;
	}

	function changePath(path: string) {

		if (path.startsWith('/')) {
			path = path.substring(1);
		}

		setPath(path);

		setTimeout(() => {
			//updateItems(path);
		}
		, 0);
	}

	return (
		<div className='App' onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}>

{/* https://fonts.google.com/icons?icon.set=Material+Symbols */}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />

			<Header></Header>
			<Explorer path={path} changePath={changePath} workspace={workspace}></Explorer>
		</div>
  );
}

export default App;

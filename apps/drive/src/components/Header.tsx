
import './Header.css';

import { LoginButton, LogoutButton, ProfileMiniature } from '../login';

function Logo() {
	return (
		<div className='app-header-logo app-left-item'>
			<img src='/logo192.png' alt='logo' height="50px"/>
			<div>OPN Drive</div>
		</div>
	);
}

export function Header() {
	return (
		<div className='app-header'>
			<Logo />
			<div style={{flexGrow:'1'}}>
				Drive @ Open Physics Notes
			</div>
			<LoginButton/>
			<LogoutButton/>
			<ProfileMiniature />
		</div>
	);
}

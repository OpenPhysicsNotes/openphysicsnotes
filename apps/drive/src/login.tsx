
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

import './login.css'

export function LoginButton() {
	
	const { loginWithRedirect } = useAuth0();

	return <button onClick={() => loginWithRedirect()}>Log In</button>;
}

export function LogoutButton() {
	const { logout } = useAuth0();
  
	return (
	  <button onClick={() => logout({ returnTo: window.location.origin })}>
		Log Out
	  </button>
	);
};

export function ProfileMiniature() {
	const { user, isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
	  return <div className="app-profile-container">Loading ...</div>;
	}

	if (!isAuthenticated) {
		return <div className="app-profile-container">Not authenticated</div>;
	}

	if (!user) {
		return <div className="app-profile-container">Not logged in</div>;
	}

	return (
		<div className="app-profile-container">
			<img src={user.picture} alt={user.name} className='app-profile-container-avatar-img'/>
			{/*<div>{user.name}</div>*/}
			{/*<p>{user.email}</p>*/}
		</div>
	);
};

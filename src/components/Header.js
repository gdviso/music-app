import React from 'react';

export default class Header extends React.Component {

	toggleOverlay() {
		this.overlay.classList.toggle('show');
	}
	showLoginModal(e) {
		e.preventDefault();
		this.loginModal.classList.add('show');
		this.toggleOverlay.call(this);
	}
	loginUser(e) {
		e.preventDefault();
		const user = {
			email: this.userEmail.value,
			password: this.userPassword.value
		}
		firebase.auth()
			.signInWithEmailAndPassword(user.email,user.password)
			.then((res) => {
				this.loginModal.classList.remove('show');
				this.toggleOverlay.call(this);
				this.userNav.classList.add('show');

			})
			.catch((err) => {
				alert(err.message);
			});
			if(this.state.loggedin === true){
			this.initialNav.classList.add('hide');
			console.log('true')
			}

	}
	createModal(e) {
		e.preventDefault();
		this.createUserModal.classList.add('show');
		this.toggleOverlay.call(this);
	}
	createUser(e) {
		e.preventDefault();

		const user = {
			email: this.createEmail.value,
			password: this.createPassword.value,
			confirm: this.confirmPassword.value
		};
		if(user.confirm !== user.password) {
			alert('Please make sure you passwords match.');
			return;
		}
		firebase.auth()
			.createUserWithEmailAndPassword(user.email,user.password)
			.then((res) => {
				this.createUserModal.classList.remove('show');
				this.toggleOverlay.call(this);
			})
			.catch((err) => {
				alert(err.message)
			});

	}
	logOut(e){
	e.preventDefault();
	this.userNav.classList.remove('hide');
	firebase.auth().signOut();

	}

	render() {
		return (
			<div>
				<header>
					<img className="logo" src="../assets/logo.png" alt=""/>
					<h1>header</h1>
					<nav className="initialNav" ref={ref => this.initialNav = ref}>
						<a href="" onClick={(e) => this.showLoginModal.call(this,e)}>Login</a>
						<a href="" onClick={(e) => this.createModal.call(this,e)}>Sign Up</a>
					</nav>
					<nav className="userNav" ref={ref => this.userNav = ref}>
						<p>Loged in as:</p>
						<a href="#" onClick={this.logOut}>Sign out</a>
					</nav>
				</header>
				<div className="overlay" ref={ref => this.overlay = ref}></div>
				<div className="loginModal modal" ref={ref => this.loginModal = ref}>
					<form action="" onSubmit={e => this.loginUser.call(this,e)}>
						<div>
							<label htmlFor="email">Email:</label>
							<input type="text" name="email" ref={ref => this.userEmail = ref}/>
						</div>
						<div>
							<label htmlFor="password">Password:</label>
							<input type="password" name="password" ref={ref => this.userPassword = ref}/>
						</div>
						<div>
							<input type="submit"/>
						</div>
					</form>
				</div>
				<div className="createUserModal modal" ref={ref => this.createUserModal = ref}>
					<form action="" onSubmit={e => this.createUser.call(this,e)}>
						<div>
							<label htmlFor="createEmail">Email:</label>
							<input type="text" name="createEmail" ref={ref => this.createEmail = ref}/>
						</div>
						<div>
							<label htmlFor="createPassword">Password:</label>
							<input type="password" name="createPassword" ref={ref => this.createPassword = ref}/>
						</div>
						<div>
							<label htmlFor="confirmPassword">Confirm Password:</label>
							<input type="password" name="confirmPassword" ref={ref => this.confirmPassword = ref}/>
						</div>
						<div>
							<input type="submit"/>
						</div>
					</form>
				</div>
			</div>
		);
	}
}


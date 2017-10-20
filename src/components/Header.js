import React from 'react';

export default class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			loggedIn:false
		}
		this.createUser = this.createUser.bind(this);
		this.logOut = this.logOut.bind(this);
	}

	toggleOverlay() {
		this.overlay.classList.toggle('show');
	}

	showLoginModal(e) {
		e.preventDefault();
		this.loginModal.classList.add('show');
		this.toggleOverlay.call(this);
	}

	hideModal(e) {
		e.preventDefault();
		this.loginModal.classList.remove('show');
		this.createUserModal.classList.remove('show');
		this.toggleOverlay.call(this);
	}

	loginUser(e) {
		e.preventDefault();
		const user = {
			email: this.userEmail.value,
			password: this.userPassword.value
		}
		firebase.auth().signInWithEmailAndPassword(user.email,user.password).then((res) => {
			this.loginModal.classList.remove('show');
			this.toggleOverlay.call(this);
		})
		.catch((err) => {
			alert(err.message);
		});
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

		firebase.auth().createUserWithEmailAndPassword(user.email,user.password).then((res) => {
			this.createUserModal.classList.remove('show');
			this.toggleOverlay.call(this);
		})
		.catch((err) => {
			alert(err.message)
		});
	}

	logOut(e) {
		e.preventDefault();
		firebase.auth().signOut();
		this.setState({
			loggedIn:false
		});
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({
					loggedIn:true
				})
			}
		});
	}

	render() {
		let loginOption;
		if (this.state.loggedIn === false) {
			loginOption = (
				<nav className="initialNav" ref={ref => this.initialNav = ref}>
					<a href="" className="logIn" onClick={(e) => this.showLoginModal.call(this,e)}>Log in</a>
					<a href="" className="signUp" onClick={(e) => this.createModal.call(this,e)}>Sign Up</a>
				</nav>
			)
		} else if (this.state.loggedIn === true) {
			loginOption = (
				<nav className="userNav" ref={ref => this.userNav = ref}>
					<a className="logOut" href="#" onClick={this.logOut}>Log out of {`${firebase.auth().currentUser.email}`}</a>
				</nav>
			)	
		}
		return (
			<div>
				<header>
					<div className="topBar">
						<div className="logo">
							<a href="index.html">
								<img className="logo animated jello" src="./public/assets/logo.svg" alt=""/>
								<img className="logo2" src="./public/assets/ymusic.svg" alt=""/>
							</a>
						</div>	
						{loginOption}
					</div>
				</header>

				<div className="overlay" onClick={(e) => this.hideModal.call(this,e)} ref={ref => this.overlay = ref} />
				
				<div className="loginModal modal" ref={ref => this.loginModal = ref}>
					<div className="close">
						<i onClick={(e) => this.hideModal.call(this,e)} className="fa fa-times-circle" aria-hidden="true"></i>
					</div>
					<div className="modalLogo">
						<img className="logo animated jello" src="./public/assets/logo.svg" alt=""/>
						<h3 className="modalTitle">Log in</h3>
					</div>
					<form className="loginForm" action="" onSubmit={e => this.loginUser.call(this,e)}>
						<div>
							<input placeholder="Enter email" type="text" name="email" ref={ref => this.userEmail = ref}/>
						</div>
						<div>
							<input placeholder="Enter password" type="password" name="password" ref={ref => this.userPassword = ref}/>
						</div>
						<div>
							<input className="modalSubmit" type="submit"/>
						</div>
					</form>
				</div>
				<div className="createUserModal modal" ref={ref => this.createUserModal = ref}>
					<div className="close">
						<i onClick={(e) => this.hideModal.call(this,e)} className="fa fa-times-circle" aria-hidden="true"></i>
					</div>
					<div className="modalLogo">
						<img className="logo animated jello" src="./public/assets/logo.svg" alt=""/>
						<h3 className="modalTitle">Log in</h3>
					</div>
					<form className="loginForm" action="" onSubmit={e => this.createUser.call(this,e)}>
						<div>
							<input placeholder="Enter email" type="text" name="createEmail" ref={ref => this.createEmail = ref}/>
						</div>
						<div>
							<input placeholder="Enter password" type="password" name="createPassword" ref={ref => this.createPassword = ref}/>
						</div>
						<div>
							<input placeholder="Confirm password" type="password" name="confirmPassword" ref={ref => this.confirmPassword = ref}/>
						</div>
						<div>
							<input className="modalSubmit" type="submit"/>
						</div>
					</form>
				</div>
			</div>
		);
	}
}	


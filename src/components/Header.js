import React from 'react';

export default class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			formToShow: '',
			email: '',
			password: '',
			confirm: ''
		};
		this.formToShow = this.formToShow.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.signup = this.signup.bind(this);
		this.login = this.login.bind(this);
	}
	formToShow(e) {
		e.preventDefault();
		this.setState({
			formToShow: e.target.className
		})
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	signup(e) {
		e.preventDefault();
		if(this.state.password === this.state.confirm){
			firebase.auth()
			.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then((userData) =>{
					console.log(userData)
				})
				// sign up errrors
				.catch(function(error) {
				   // Handle Errors here.
				   var errorCode = error.code;
				   var errorMessage = error.message;
				   // [START_EXCLUDE]
				   if (errorCode == 'auth/weak-password') {
				     alert('The password is too weak.');
				   } else {
				     alert(errorMessage);
				   }
				});
		}else{
			alert('passwords do not match')
		}
	}
	login(e) {
		e.preventDefault();
		const email = this.userEmail.value;
		const password = this.userPass.value;
		firebase.auth()
		.signInWithEmailAndPassword(this.state.email, this.state.password)
		.then ((userData) =>{
			console.log(userData)
			alert(`Welcome ${this.state.email}!`)
			
		})
        //sign in errors:
       .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
        });
	}
	render() {
		let loginForm = '';
		if(this.state.formToShow === 'signup') {
			loginForm = (
				<div className="signUpForm">
					<form onSubmit={this.signup} className="user-form">
						<label htmlFor="email">Email: </label>
						<input required type="email" name="email" onChange={this.handleChange} />
						<label htmlFor="password">Password: </label>
						<input required type="password" name="password" onChange={this.handleChange} />
						<label htmlFor="confirm">Confirm Password:</label>
						<input required type="password" name="confirm" onChange={this.handleChange} />
						<button>Sign In</button>
					</form>
				</div>
			);
		}
		else if(this.state.formToShow === "login") {
			loginForm = (
				<div className="overlay">
					<div className="loginForm" ref={ref => this.loginForm = ref}>
						<div className="close">
						X
						</div>
						<form onSubmit={this.login} className="user-form">
							<label htmlFor="email">Email: </label>
							<input type="email" name="email" onChange={this.handleChange} ref={ref => this.userEmail = ref}/>
							<label htmlFor="password">Password: </label>
							<input type="password" name="password" onChange={this.handleChange} ref={ref => this.userPass = ref}/>
							<input type="submit" value="Log-in"/>
						</form>
					</div>
				</div>	
			);
		}
		return (
			<div>
				<header>
					<h1>Welcome {this.state.email}</h1>
					<nav>
						<ul>
							<li><a href="" className="signup" onClick={this.formToShow}>Sign Up</a></li>
							<li><a href="" className="login" onClick={this.formToShow}>Log In</a></li>
						</ul>
					</nav>
				</header>
				{loginForm}
			</div>
		)
	}
}
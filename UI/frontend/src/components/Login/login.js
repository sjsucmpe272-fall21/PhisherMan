import React, { Component } from 'react';
// import './App.css';
import axios from 'axios';
// import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
// import { constats } from './ip/config';



//Define a Login Component
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            authFlag: false,
            message: ""
        }
        //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    // //Call the Will Mount to set the auth Flag to false
    // componentWillMount() {
    //     this.setState({
    //         authFlag: false
    //     })
    // }
    //username change handler to update state variable with the text entered by the user
    emailChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {

        e.preventDefault();
        const data = {
            email: this.state.username,
            password: this.state.password
        }

        //set the with credentials to true
        axios.defaults.withCredentials = true;

        //make a post request with the user data
        axios.post(`http://localhost:5000/api/v1/users/login`, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    return <Redirect to={'/signup'} />;
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    authFlag: false,
                    message: 'Invalid Credentials'
                })

            });
    }

    render() {
        
        return (
            <div>
                <div className="container">
                    <div className="login-form">
                        <div className="main-div">
                            <div className="panel">
                                <h2>Login</h2>
                                <p>Please enter your Email and Password</p>
                                <h3>
                                    {this.state.message}
                                </h3>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-4">
                                    <input required="required" onChange={this.emailChangeHandler} type="text" className="form-control" name="Email" placeholder="Email" />
                                </div>
                                <br />
                                <br />
                            </div>
                            <div className="form-group">
                                <div className="col-sm-4">
                                    <input required="required" onChange={this.passwordChangeHandler} type="password" className="form-control" name="password" placeholder="Password" />
                                </div>
                            </div>
                            <br />
                            <br /><br />
                            <button onClick={this.submitLogin} className="btn btn-primary">Login</button>
                        </div>
                        <br />
                        <Link to="/signup">Signup here</Link>
                    </div>
                </div>
            </div>
        )
    }
}

//export Login Component
export default Login;
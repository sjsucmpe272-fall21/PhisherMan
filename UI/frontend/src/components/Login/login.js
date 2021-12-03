import React, { Component } from 'react';
import axios from 'axios';
// import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link, Navigate, Switch, Route } from 'react-router-dom';

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

    emailChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    submitLogin = (e) => {

        e.preventDefault();
        const data = {
            email: this.state.username,
            password: this.state.password
        }

        //set the with credentials to true
        axios.defaults.withCredentials = true;

        //make a post request with the user data
        axios.post(`http://localhost:3001/login`, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    <Navigate to="/search" />
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
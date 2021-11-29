import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { constats } from './ip/config';


//Define a Login Component
class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username: "",
            password: "",
            userType: "",
            authFlag: false,
            message: ""
        }
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
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
    usernameChangeHandler = (e) => {
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
        //var headers = new Headers();

        //prevent page from refresh
        e.preventDefault();
        const data = {
            email: this.state.username,
            password: this.state.password
        }

        //set the with credentials to true
        axios.defaults.withCredentials = true;

        //make a post request with the user data
        axios.post(`http://${constats.AWS.ipAddress}:3001/login`, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    // this.setState({
                    //     authFlag: true,
                    //     userType: response.data.userType
                    // })
                    <Redirect to="/home"></Redirect>
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
        //redirect based on successful login
        // let redirectVar = null;
        // console.log("this.state.userType: ", this.state.userType)
        // if (cookie.load('cookie')) {
        //     if (this.state.userType === "customer") {
        //         console.log("customer");
        //         redirectVar = <Redirect to="/home" />
        //     }
        //     else {
        //         console.log("rest");
        //         redirectVar = <Redirect to="/restroHome" />
        //     }
        // }
        return (
            <div>
                {/* {redirectVar} */}

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
                                    <input required="required" onChange={this.usernameChangeHandler} type="text" className="form-control" name="username" placeholder="Username" />
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
                        <Link to="/signup">Signup</Link>
                    </div>
                </div>
            </div>
        )
    }
}

//export Login Component
export default Login;
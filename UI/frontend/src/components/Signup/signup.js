import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link, Routes } from 'react-router-dom';

//Define a Login Component
class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            contact: "",
            zipCode: "",
            streetAddress: "",
            city: "",
            authFlag: false,
            message: ""
        }
        //Bind the handlers to this class

        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.contactChangeHandler = this.contactChangeHandler.bind(this);
        this.zipCodeChangeHandler = this.zipCodeChangeHandler.bind(this);
        this.streetAddressChangeHandler = this.streetAddressChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
    }

    //firstName change handler to update state variable with the text entered by the user
    firstNameChangeHandler = (e) => {
        this.setState({
            firstName: e.target.value
        })
    }
    //lastName change handler to update state variable with the text entered by the user
    lastNameChangeHandler = (e) => {
        this.setState({
            lastName: e.target.value
        })
    }
    //email change handler to update state variable with the text entered by the user
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    //Contact change handler to update state variable with the text entered by the user
    contactChangeHandler = (e) => {
        this.setState({
            contact: e.target.value
        })
    }
    //Zip Code change handler to update state variable with the text entered by the user
    zipCodeChangeHandler = (e) => {
        this.setState({
            zipCode: e.target.value
        })
    }
    //Street Address change handler to update state variable with the text entered by the user
    streetAddressChangeHandler = (e) => {
        this.setState({
            streetAddress: e.target.value
        })
    }
    //City change handler to update state variable with the text entered by the user
    cityChangeHandler = (e) => {
        this.setState({
            city: e.target.value
        })
    }

    //submit Login handler to send a request to the node backend
    submitSignup = (e) => {

        e.preventDefault();
        const data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            
            contact: this.state.contact,
            zipCode: this.state.zipCode,
            streetAddress: this.state.streetAddress,
            city: this.state.city,
            
        }

        console.log("before signup");
        //make a post request with the user data
        axios.post(`http://localhost:5000/api/v1/users`, data)
            .then(response => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        authFlag: true,
                        message: 'You Are Signed up!!!, Now continue to login.'
                    })
                }
                else if (response.status === 201) {
                    console.log(response.data)
                    this.setState({
                        message: "Email already exsists",
                        authFlag: false
                    })
                    //console.log("Status Code Now: ", this.state.username);
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    authFlag: false,
                    message: 'Details not Stored'
                })
                console.log(this.state.message);
            });
    }

    render() {
        let SignupForm = <div className="container" id="user-profile-details-form">

            <br />
            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="email">First Name:</label>
                <div className="col-sm-4">
                    <input type="text" onChange={this.firstNameChangeHandler} className="form-control" id="firstName" placeholder="First Name" name="firstName" required />
                </div>
            </div>
            <br />
            <br />

            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="email">Last Name:</label>
                <div className="col-sm-4">
                    <input type="text" onChange={this.lastNameChangeHandler} className="form-control" id="firstName" placeholder="Last Name" name="lastName" required />
                </div>
            </div>
            <br />
            <br />

            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="email">Email:</label>
                <div className="col-sm-4">
                    <input type="email" onChange={this.emailChangeHandler} className="form-control" id="email" placeholder="Email" name="email" required />
                </div>
            </div>
            <br />
            <br />

            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="email">Password:</label>
                <div className="col-sm-4">
                    <input type="password" onChange={this.passwordChangeHandler} className="form-control" id="password" placeholder="Password" name="password" required />
                </div>
            </div>
            <br />
            <br />


            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="contact">Contact:</label>
                <div className="col-sm-4">
                    <input type="text" onChange={this.contactChangeHandler} className="form-control" id="contacat" placeholder="Contact number" name="contact" required />
                </div>
            </div>
            <br />
            <br />

            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="zipCode">Zip Code:</label>
                <div className="col-sm-4">
                    <input type="text" onChange={this.zipCodeChangeHandler} className="form-control" id="zipCode" placeholder="Zip Code" name="zipCode" required />
                </div>
            </div>
            <br />
            <br />

            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="streetAddress">Street Address:</label>
                <div className="col-sm-4">
                    <input type="text" onChange={this.streetAddressChangeHandler} className="form-control" id="city" placeholder="Street Address" name="streetAddress" required />
                </div>
            </div>
            <br />
            <br />

            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="city">City:</label>
                <div className="col-sm-4">
                    <input type="text" onChange={this.cityChangeHandler} className="form-control" id="city" placeholder="City" name="city" required />
                </div>
            </div>
            <br />
            <br />

            <div className="form-group">
                <div className="col-sm-4">
                    <br />
                    <button onClick={this.submitSignup} className="btn btn-primary">Submit</button>
                </div>
            </div>
            <br />
            <br />
            <br/>
            <Link to="/login">Login here</Link>
            
        </div>;

        return (<div className="container">
            <h2>Signup Here</h2>
            <h5>
                {this.state.message}
            </h5>
            {SignupForm}


        </div>);
    }
}

//export Signup Component
export default Signup;
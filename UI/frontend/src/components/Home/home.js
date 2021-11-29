import React, { Component } from 'react'
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import axios from 'axios';
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import './CSS/home.css';
import { Redirect } from 'react-router';
import { constats } from './ip/config';

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        console.log("Inside did mount");
        const data = {
            // email: Cookies.get('cookie')
        }
        axios.post(`https://q7zcjspceh.execute-api.us-west-1.amazonaws.com/api/v1/detect/` + data)
            .then((response) => {

                console.log('Malicious data from backend ', response.data)

                this.setState({
                    isMalicious: response.data
                })
            }).catch(function (e) {
                console.log(e);
                console.error(e.message);
            });
    }

    searchChangeHandler = (e) => {
        let a = e.target.getAttribute("id");
        this.setState({
            restaurantSelect: JSON.parse(a)
        })
    }

    render() {

        return (
            <div>
                <p class="ex1"><b><i>Check if the website URL is malacious or not</i></b></p>
            </div>
        )
    }
}

export default Home;
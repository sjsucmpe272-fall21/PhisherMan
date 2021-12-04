"use strict";
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
const { mongoDB } = require('./utils');
const mongoose = require('mongoose');
const User = require('./ModelUser');


//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret: 'cmpe272_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 10000,    // Overall duration of Session : 300 minutes : 18000 seconds
    activeDuration: 5 * 60 * 10000
}));

app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0
};

mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
        console.log(err);
        console.log(`MongoDB Connection Failed`);
    } else {
        console.log(`MongoDB Connected`);
    }
});

//LOGIN API
app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email, password: req.body.password }, (error, user) => {
        if (error) {
            callback(null, "Error Occured");
        }
        if (user) {
            console.log("login api 200 status");
            res.status(200).send("Login Successful");
        }

        else {

            res.status(400).send("Invalid Credentials");
        }
    });
});


//User Signup
app.post('/signup', (req, res) => {
    var NewUser = User({
        firstName: req.body.fistName,
        lastName: req.body.fistName,
        email: req.body.email,
        password: req.body.password,
        contact: req.body.contact,
        zipCode: req.body.zipCode,
        streetAddress: req.body.streetAddress,
        city: req.body.city
    });
    User.findOne({ email: req.body.email }, (error, email) => {
        if (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end("Error in 500", error);
        }
        if (email) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("E-mail id already exsits");
        }
        else {
            NewUser.save((error, data) => {
                if (error) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    })
                    console.log("error code 500")
                    res.end();
                }
                else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("User added successfully!");
                }
            });
        }
    });
});

app.listen(3001, () => console.log("Server Listening on port 3001"));
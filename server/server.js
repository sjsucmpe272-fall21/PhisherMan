"use strict";
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const User = require("../server/models/User");
var bodyParser = require('body-parser');
// var express = require('express');
var app = express();
var cors = require('cors');
var session = require('express-session');
const users = require("./routes/users");

// const app = express();
// app.use(express.json());


//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(cors({ origin: 'http://localhost:5000', credentials: true }));

//use express session to maintain session data
app.use(session({
	secret: 'cmpe272',
	resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
	saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
	duration: 60 * 60 * 10000,    // Overall duration of Session : 30 minutes : 1800 seconds
	activeDuration: 5 * 60 * 10000
}));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
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

connectDB();


dotenv.config({ path: "./config/config.env" });



if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
const PORT = process.env.PORT || 5000;

app.use("/api/v1/users", users);

//API's
app.post('/login', (req, res) => {
	User.findOne({ email: req.body.email, password: req.body.password }, (error, user) => {
		if (error) {
			res.writeHead(500, {
				'Content-Type': 'text/plain'
			})
			res.end("Error Occured");
		}
		if (user) {
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			})
			console.log("User login api 200 status")
			res.end("User login api 200 status");
		}
	});
});


app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
);
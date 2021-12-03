const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: String },
    zipCode: { type: String },
    streetAddress: { type: String },
    city: { type: String },
},
    {
        versionKey: false, timestamps: true
    });

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
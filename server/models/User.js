const mongoose = require('mongoose');
const UserProfileSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true
        },
        firstName:{
            type: String
        },
        lastName:{
            type: String
        },
        password:{
            type: String
        },
        address:{
            type: String
        },
        dateOfBirth:{
            type: String
        },
        urls:{
            type: Object,
            trim: true
        },

    }
);

module.exports = mongoose.model("User", UserProfileSchema); 

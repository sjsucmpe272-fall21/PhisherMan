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
        contact:{
            type: String
        },
        zipCode:{
            type: String
        },
        address:{
            type: String
        },
        city:{
            type: String
        },
        urls:{
            type: Object,
            trim: true
        },

    }
);

module.exports = mongoose.model("User", UserProfileSchema); 

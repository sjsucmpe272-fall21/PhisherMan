const mongoose = require('mongoose');
const UserProfileSchema = new mongoose.Schema(
    {
        
        firstName:{
            type: String
        },
        lastName:{
            type: String
        },
        email:{
            type: String,
            required: true,
            unique: true
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
        streetAddress:{
            type: String
        },
        city:{
            type: String
        },
    }
);

module.exports = mongoose.model("User", UserProfileSchema); 

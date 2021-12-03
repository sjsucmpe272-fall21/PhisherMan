const mongoose = require('mongoose');
const UrlsSchema = new mongoose.Schema(
    {
        url:{
            type: String,
            
        },
        isMalicious:{
            type: String
        },
        

    }
);

module.exports = mongoose.model("Urls", UrlsSchema); 
const mongoose = require("mongoose");

const chatlogSchema = mongoose.Schema({
    
    message: {
        type : String,
        required : true
    },
    timestamp: {
        type : Date,
        default : Date.now
    },
    isSent: {
        type : Boolean,
        required : true 
    },
    author : {
        type : String,
        required : true 
    }
 
})

module.exports = mongoose.model('Chatlog', chatlogSchema);
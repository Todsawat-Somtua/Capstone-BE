const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    title : {   
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    sale : {    
        type: Boolean
    },
    price: {
        type: Number
    },  
    category: {
        type: String
    },
    uploadTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }   });

module.exports = mongoose.model('Image', ImageSchema);

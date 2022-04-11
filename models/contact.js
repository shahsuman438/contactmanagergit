const mongoose=require('mongoose');
const contactTypeSchema=require('./contactType').schema 
const contactSchema=new mongoose.Schema({
    fav:{
        type:Boolean,
        default:false
    },
    name:{ 
        type:String,
        required:true,
    },
    number:[contactTypeSchema],
    email:{
        type:String
    },
    address:{
        type:String,
    },
    photo:{
        type:String
    },
    created:{
        type:Date,
        default:Date.now
    }

});


module.exports = mongoose.model("contact",contactSchema); 
const mongoose=require('mongoose');

const contactTypeSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    number:{
        type:Number,
    }
});


module.exports = mongoose.model("contactType",contactTypeSchema); 
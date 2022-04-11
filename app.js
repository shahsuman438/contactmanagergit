require("dotenv").config({path:"./config.env"})

const express = require('express')
const mongoose= require('mongoose')
const app=express();
const url = process.env.MONGO_URI
const contactRouter=require('./routers/contact')
const userRouter=require('./routers/user')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const globalContact =require('./routers/globalContact')
const count=require('./routers/count')
const PORT = process.env.PORT || 4000
const path=require('path')
const corsOptions={
    origin:'http://localhost:3000',
    credentials:true
}

mongoose.connect(url,{useNewUrlParser:true})

const connect=mongoose.connection
connect.on('open',()=>{
    console.log("######### DATABASE CONNECTED...######")
})




app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/contact',contactRouter)
app.use('/uploads',express.static('uploads'))
app.use('/auth',userRouter)
app.use('/globalContact',globalContact)
app.use('/count',count)


if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"/contact_manager_UI/build")));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'contact_manager_UI','build','index.html'))
    })
}else{
    app.get('/',(req,res)=>{
        res.send("API Running")
    })
}


app.listen(PORT,()=>{
    console.log("#########SERVER STARTED...########")
})
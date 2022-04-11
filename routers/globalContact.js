const express=require('express')
const contactModels=require('../models/contact')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')




router.get('/',verifyToken,async(req,res)=>{
    try {
        contactModels.find()
        .then(
            data=>{
                res.status(200).json(data)
            }
        )
    } catch (error) {
        res.send(500).json({'msg':'Internal server error'})
    }
})

router.get('/:id',async(req,res)=>{
        try{
            const contact=await contactModels.findById(req.params.id)
            res.json(contact)
        }catch(err){
            console.log(err)
        }
    })

router.delete('/:id',async(req,res)=>{
    try{
        contactModels.deleteOne({_id:req.params.id}).then(
            (result)=>{
                res.json(result)
            }
        )
    }catch(err){
        res.send(err)
    }
})


module.exports=router
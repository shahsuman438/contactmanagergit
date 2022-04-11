const express=require('express')
const contactModels=require('../models/contact')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const chartCalcFun=require('../controller/chartCalc')
const userModel=require('../models/user')

router.get('/',verifyToken,async(req,res)=>{
    try {
        contactModels.find()
        .then(
            data=>{
                const chart=chartCalcFun(data)
                res.status(200).json(chart)
            }
        )
    } catch (error) {
        res.send(500).json({'msg':'Internal server error'})
    }
})

router.get('/userContact', verifyToken, async (req, res) => {
    try {
        userModel.findById(req.userId.subject).then(
            async (user) => {
                const chart=chartCalcFun(user.contacts)
                res.status(200).send(chart)
            }
        )
    } catch (erorr) {
        res.send(500, { "msg": "Something went wrong" })
    }
})

module.exports=router
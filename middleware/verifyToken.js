const jwt=require('jsonwebtoken')



function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send({"msg":"Unauthorized Access"})
    }
    let token=req.headers.authorization.split(' ')[1]
    if(token==null){
        return res.status(401).send({"msg":"Unauthorized Access"})
    }
    try {
        let payload=jwt.verify(token,'skaccess')
        if(!payload){
            console.log("!payload")
            return res.status(401).send({"msg":"Unauthorized Access"})
        }
        req.userId=payload
        next() 
        
    } catch (error) {
        return res.status(401).send({"msg":error.name})
    }
     
}


module.exports=verifyToken
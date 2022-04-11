
const jwt=require('jsonwebtoken')


const  generateAccessToken=async(user)=>{
    const {_id}=user
    let payload={subject:_id}
    const accesstoken= await jwt.sign(payload,'skaccess')
    return accesstoken
}

module.exports=generateAccessToken

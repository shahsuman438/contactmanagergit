const express = require('express')
const userModel = require('../models/user')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const verifytoken = require('../middleware/verifyToken')
const userUpload = require('../middleware/userUpload')


const Refreshtokens = []

router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    req.body.password = hashPassword
    let user = new userModel(req.body)
    userModel.findOne({ "email": req.body.email }).then(
        data => {
            if (data) {
                res.status(401).send({ "msg": "Email already exist" })
            } else {
                user.save((error, registerUser) => {
                    if (error) {
                        console.log('Error', error)
                    } else {
                        let payload = { subject: registerUser._id }
                        let accessToken = jwt.sign(payload, 'skaccess', { expiresIn: "1800s" })
                        let refreshToken = jwt.sign(payload, 'skrefresh', { expiresIn: "86400s" })
                        Refreshtokens.push(refreshToken)
                        res.status(200).cookie("RefreshToken", refreshToken, { sameSite: 'strict', httpOnly: true }).json({ "AccessToken": accessToken, "RefreshToken": refreshToken })
                    }
                })
            }
        }
    )
})



router.get('/user', verifytoken, async (req, res) => {
    try {
        userModel.findById(req.userId.subject).then(
            (data) => {
                res.status(200).send(data)
            }
        )
    } catch (error) {
        res.status(404).send({
            "msg": "user not found"
        })
    }
})

router.delete('/user/:id', verifytoken, async (req, res) => {
    try {
        userModel.deleteOne({ _id: req.params.id }).then(
            (result) => {
                res.status(200).send({ "msg": "Deleted Success" })
            }
        )
    } catch (error) {
        res.status(404).send({
            "msg": "user not found"
        })
    }
})



router.get('/users', verifytoken, async (req, res) => {
    try {
        userModel.find().then(data => {
            res.status(200).send(data)
        }).catch(err => { res.status(404).send({ "msg": "user not found" }) })
    } catch (error) {
        res.status(500).send({
            "msg": "somthing went wrong"
        })
    }
})



router.put('/user/profile', userUpload.single('photo'), verifytoken, async (req, res) => {
    try {
        const user = userModel.find({ _id: req.userId.subject })
        userModel.updateOne({ _id: req.userId.subject }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                country: req.body.country,
                photo: req.file ? req.file.path : user.photo,
            }
        }).then(result => {
            res.send({ "msg": "user updated" })
        })

    } catch (error) {
        console.log("##Error:-", error)
    }

})


router.post('/login', async (req, res) => {

    try {
        userModel.findOne({ email: req.body.email }).then(
            async (user) => {
                const isMatched = await bcrypt.compare(req.body.password, user.password)
                if (isMatched) {
                    let payload = { subject: user._id }
                    let accessToken = jwt.sign(payload, 'skaccess', { expiresIn: "1800s" })
                    let refreshToken = jwt.sign(payload, 'skrefresh', { expiresIn: "86400s" })
                    Refreshtokens.push(refreshToken)
                    res.status(200).cookie("RefreshToken", refreshToken, { sameSite: 'strict', httpOnly: true }).json({ "AccessToken": accessToken, "RefreshToken": refreshToken })
                } else {
                    res.status(401).json({ "msg": "invalid password" })
                }
            }
        ).catch(
            error => res.status(401).json({ "msg": "Invalid Email" })
        )

    } catch (error) {
        res.status(500).send({ "msg": "Somthing went wrong" })
    }
})

router.post('/user/reset', verifytoken, async (req, res) => {
    try {
        userModel.findOne({ _id: req.userId.subject }).then(
            async (user) => {
                const isMatched = await bcrypt.compare(req.body.lastpqassword, user.password)
                if (isMatched) {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(req.body.newpassword, salt)
                    user.password = hashPassword
                    user.save()
                    res.status(200).json({ "msg": "Password Reset Success" })
                } else {
                    res.status(401).json({ "msg": "Last password Not matched" })

                }
            }
        ).catch(
            error => res.status(401).json({ "msg": "User not found" })
        )
    } catch (error) {

    }
})


router.post('/refreshToken', (req, res) => {
    const refreshToken = req.cookies.RefreshToken
    if (!refreshToken || !Refreshtokens.includes(refreshToken)) {
        res.status(403).json({ "msg": "Not authenticatedes" })
    }
    else {
        jwt.verify(refreshToken, 'skrefresh', (err, user) => {
            if (!err) {
                let payload = { subject: user.subject }
                let accessToken = jwt.sign(payload, 'skaccess', { expiresIn: "1800s" })
                res.status(200).json({ "AccessToken": accessToken })
            } else {
                res.status(403).json({ "msg": "Not authenticated" })
            }
        })
    }
})

router.post('/logout', (req, res) => {
    res.status(202).clearCookie('RefreshToken').json({ "msg": "Log Out Success" })
})

module.exports = router 

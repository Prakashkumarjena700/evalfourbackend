const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { userModel } = require("../models/user.model")

const userRoute = express.Router()

userRoute.post("/register", async (req, res) => {
    const { name, email, gender, password, age, city } = req.body
    try {
        const user = await userModel.find({ email })
        if (user.length > 0) {
            res.send({ "msg": "User already exist, please login" })
        } else {
            bcrypt.hash(password, 9, async (err, hash) => {
                if (err) {
                    res.send({ "msg": "Something went wrong" })
                } else {
                    const user = new userModel({ name, email, gender, password: hash, age, city })
                    await user.save()
                    res.send({ "msg": "User has been register" })
                }
            })
        }
    } catch (err) {
        res.send({ "msg": "Can't register" })
    }
})

userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user[0]._id }, 'masai')
                    res.send({ "msg": "Login sucessfull", token })
                } else {
                    res.send({ "msg": "Wrong Crediential" })
                }
            })
        } else {
            res.send({ "msg": "Wrong Crediential" })
        }
    } catch (err) {
        res.send({ "msg": "Something went wrong" })
    }
})

module.exports = {
    userRoute
}
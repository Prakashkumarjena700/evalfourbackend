const express = require("express")
const { postModel } = require("../models/post.model")

const postRoute = express.Router()

postRoute.get("/", async (req, res) => {

    const { device } = req.query
    const user_making_request = req.body.user

    let query;
    if (device === undefined) {
        query = { user: user_making_request }
    } else {
        query = { user: user_making_request, device }
    }


    try {
        let data = await postModel.find(query)
        res.send(data)
    } catch (err) {
        res.send({ "msg": "Can't find" })
    }
})

postRoute.post("/create", async (req, res) => {
    try {
        const post = new postModel(req.body)
        await post.save()
        res.send({ "msg": "Post sucessful" })
    } catch (err) {
        res.send({ "msg": "Post not sucessful" })
    }
})
postRoute.get("/top", (req, res) => {
    res.send("Here get top comment")
})
postRoute.patch("/update/:id", async (req, res) => {
    const payload = req.body
    const id = req.params.id
    const note = await postModel.findOne({ "_id": id })
    const user_id_in_note = note.user
    const user_id_making_req = req.body.user

    try {
        if (user_id_making_req != user_id_in_note) {
            res.send({ "msg": "Your not authorished" })
        } else {
            await postModel.findByIdAndUpdate({ "_id": id }, payload)
            res.send({ "msg": "Your post has been updated" })
        }
    } catch (err) {
        res.send({ "msg": "Post is not updated" })
    }
})
postRoute.delete("/delete/:id", async (req, res) => {
    const id = req.params.id
    const note = await postModel.findOne({ "_id": id })
    const user_id_in_note = note.user
    const user_id_making_req = req.body.user
    try {
        if (user_id_making_req != user_id_in_note) {
            res.send({ "msg": "Your not authorished" })
        } else {
            await postModel.findByIdAndDelete({ "_id": id })
            res.send({ "msg": "Your post has been Removed" })
        }
    } catch (err) {
        res.send({ "msg": "Post is not Removed" })
    }
})

module.exports = {
    postRoute
}
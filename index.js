const express = require("express")
const { connection } = require("./config/db")
const { userRoute } = require("./routes/user.route")
const { postRoute } = require("./routes/post.route")
const { authentication } = require("./middlewares/authentication.middleware")
const { postModel } = require("./models/post.model")

const app = express()

app.use(express.json())
app.get("/", async (req, res) => {
    try {
        let posts = await postModel.find()
        res.send(posts)
    } catch (err) {
        res.send({ "msg": "Can't get data" })
    }
})
app.use("/users", userRoute)
app.use(authentication)
app.use("/posts", postRoute)

app.listen(4500, async () => {
    try {
        await connection
        console.log("Connected to DB")
    } catch (err) {
        console.log("Not Connected to DB")
    }
    console.log("Server is runing at port 4500")
})
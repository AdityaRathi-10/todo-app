import express from "express"
import { connectDB } from "./connection.js"
import { DB_NAME } from "./constants.js"
import dotenv from "dotenv"
import path from "path"
import cookieParser from "cookie-parser"
import { verifyJWT } from "./middlewares/auth.middleware.js"

import { getAllTodos } from "./controllers/todo.controller.js"

import userRouter from "./routes/user.routes.js"
import todoRouter from "./routes/todo.routes.js"
import subTodoRouter from "./routes/subTodo.routes.js"
import { get } from "http"

dotenv.config({
    path: "./.env"
})

const app = express()
const PORT = 8005

connectDB(`${process.env.MONGODB_URI}/${DB_NAME}`)
.then(() => console.log("MongoDB connected successfully"))
.catch((error) => console.log("Error", error))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("./public"))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use("/user", userRouter)
app.use("/todo", todoRouter)
app.use("/sub-todo", subTodoRouter)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.listen(process.env.PORT || PORT, () => console.log(`Server started at port:${process.env.PORT}`))
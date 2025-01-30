import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN || "http://localhost:5173/");
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173/",
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.route.js"
import keepNoteRouter from "./routes/keepNote.route.js"
import labelRouter from "./routes/label.router.js"

app.use("/user", userRouter)
app.use("/keepnote", keepNoteRouter)
app.use("/label", labelRouter)

app.get("/", (req, res) => {
    res.send("working")
})


export { app }
import express from 'express'


const app = express()

app.use(express.json({ limit: "4mb" }))
app.use(express.urlencoded({ extended: true, limit: "4mb" }))
app.use(express.static('public'))


// routes import

import fileUploadRoute from "./routes/fileupload.routes.js"
import userRoute from "./routes/users.routes.js"

// routes declaration

app.use("/api/v1/fileupload", fileUploadRoute)
app.use("/api/v1/users/", userRoute)


export { app }
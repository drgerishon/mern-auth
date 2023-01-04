const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT || 5000
//CONNECT TO MONGO DB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
})
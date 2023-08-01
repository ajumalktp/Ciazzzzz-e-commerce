const express = require('express')
const app = express()
const path = require('path')
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
const dbConnect = require('./dbConnect')
const dotenv = require('dotenv')
const PORT = process.env.PORT || 8080

dotenv.config({path:'.env'})
// Data BaseConnection
dbConnect()

app.set("view engine","ejs")
app.use(express.urlencoded({ extended: true }));
app.use(express.json())



app.use(express.static(path.join(__dirname, "public")));



app.use('/',userRouter)
app.use('/admin',adminRouter)

app.listen(PORT,()=>console.log(`Server started at http://localhost:${PORT}`))
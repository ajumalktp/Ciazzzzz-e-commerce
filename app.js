const express = require('express')
const app = express()
const path = require('path')
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
const PORT = process.env.PORT || 8080


app.set("view engine","ejs")
app.use(express.static(path.join(__dirname, "public")));

app.use('/',userRouter)
app.use('/admin',adminRouter)

app.listen(PORT,()=>console.log(`Server started at http://localhost:${PORT}`))
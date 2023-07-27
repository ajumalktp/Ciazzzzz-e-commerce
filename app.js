const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 8080


app.set("view engine","ejs")
app.use(express.static(path.join(__dirname, "public")));
app.get('/login',(req,res)=>{
    res.render('userLogin')
})
app.get('/signUp',(req,res)=>{
    res.render('userSignUp')
})

app.listen(PORT,()=>console.log(`Server started at http://localhost:${PORT}`))
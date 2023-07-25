const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080

app.set("view engine","ejs")
app.get('/',(req,res)=>{
    res.render('shop')
})

app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
})
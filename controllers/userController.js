const asyncHandler = require('express-async-handler')

const userController = {
getHome:asyncHandler((req,res)=>{
    res.render('userHome')
}),

getLogin:asyncHandler((req,res)=>{
    res.render('userLogin')
}),

getSignUp:asyncHandler((req,res)=>{
    res.render('userSignUp')
})
}
module.exports = userController
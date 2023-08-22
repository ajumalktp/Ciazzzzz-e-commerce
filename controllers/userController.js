const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const otpGen = require('otp-generator')

let otp = otpGen.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false , specialChars: false });

const userController = {
  getHome: asyncHandler(async(req, res) => {
    res.render("userHome");
  }),

  getLogin:(req, res) => {
    res.render("userLogin");
  },

  userLogin: async(req,res)=>{
    const {email, password} = req.body
    const user = await userModel.findOne({email})

    if(user){
      if(password == user.password){
        req.session.user = true
        req.session.user = {
          id: user._id,
          name: user.name
        }
        console.log(user)
        res.redirect('/')
      }else{
        const error = 'invalid email or password'
        console.log(error)
        res.render('userLogin',{error})
      }
    }else{
      error = 'user NOT FOUND'
      console.log(error)
      res.render('userLogin',{error})
    }
  },

  getUserRegister:(req, res) => {
    res.render("userSignUp");
  },

  userRegister:async(req, res) => {
    const { name, email, phone, password } = req.body;

    const emailExist = await userModel.find({email})
    if(emailExist){
      return res.render('userSignUp',{err:true, message:'This user already Exists'})
    }else{
      req.session.userDetails = req.body
    }



  },
  submitOtp:(req,res)=>{
    res.render('submitOtp')
  },
};
module.exports = userController;

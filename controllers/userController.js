const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const otpGen = require('otp-generator')
const sendOtp = require('../services/OtpMail')
const bycrypt = require('bcrypt')

let otp = otpGen.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false , specialChars: false });

const userController = {
  getHome: async(req, res) => {
    res.render("userHome");
  },

  getLogin:(req, res) => {
    res.render("userLogin");
  },

  userLogin: async(req,res)=>{
    const {email, password} = req.body
    const user = await userModel.findOne({email})

    if(user){
      if(await bycrypt.compare(password, user.password)){
        if(!user.ban){
        req.session.user = true
        req.session.user = {
          id: user._id,
          name: user.name
        }
        console.log(user)
        res.redirect('/')
        }else{
          const error = 'You are Banned!'
          res.render('userLogin',{error})
        }
      }else{
        error = 'invalid email or password'
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

  submitOtp:(req,res)=>{
    res.render('submitOtp')
  },

  userRegister:async(req, res) => {
    const { name, email,} = req.body;

    const emailExist = await userModel.findOne({email})
    
    if(emailExist){
      const error  = 'Email already exists'
      return res.render('userSignUp',{error})
    }else{
      req.session.userDetails = req.body
    }
    sendOtp(name,email,otp)
    req.session.email = email
    req.session.otp = otp
    
    res.redirect('/submitOtp')
  },

  verifyOtp: async(req,res)=>{
    const {name, email, phone, password} = req.session.userDetails;
    let otp = req.body.otp.join('')
    console.log(name);
    if(req.session.otp == otp){

      const hashPass = await bycrypt.hash(password,10)
      const user = new userModel({
        name:name,
        email:email,
        phone:phone,
        password:hashPass,
      })
      user.save()
      res.redirect('/login')
    }else{
      const error = 'Incorrect OTP'
      res.render('submitOtp',{error})
    }
  }





};
module.exports = userController;

const userModel = require("../models/userModel");
const productModel = require('../models/productModel')
const cartModel = require('../models/cartModel')
const otpGen = require('otp-generator')
const sendOtp = require('../services/OtpMail')
const bycrypt = require('bcrypt');

function generateOtp(){
  return otpGen.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false , specialChars: false });
}
let otp = generateOtp()


const userController = {
  getHome: async(req, res) => {
    const products = await productModel.find().lean()
    let count = 0
    if(req.session.user){
      const buyNow = await cartModel.findOne({user:req.session.user.id,method:'buyNow'})
      if(buyNow){
        await cartModel.deleteOne({ user: req.session.user.id,method:'buyNow' });
      }
      const user = await cartModel.findOne({user:req.session.user.id})
      if(user){
          count = user.products.length
      }
    }else{
      count = 0
    }
    res.render("user/userHome",{products,count,user:req.session.user});
  },

  getLogin:(req, res) => {
    if(!req.session.user){
      const {email,password} = req.body
    const failedAuthData = {
      email:email || '',
      password:password || ''
    }
    res.render("user/userLogin",{failedAuth:failedAuthData});
    }else{
      res.redirect('/profile')
    }
    
  },

  getProfile: async(req,res)=>{
    const _id = req.session.user.id
    req.session.backURL = '/profile'
    const user= await userModel.findOne({_id})
    if(req.session.user){
      res.render('user/userProfile',{user})
    }else{
      res.redirect('/login')
    }
  },

  userLogin: async(req,res)=>{
    const {email, password} = req.body
    const user = await userModel.findOne({email})

    const failedAuthData = {
      email:email || '',
      password:password || ''
    }

    if(user){
      if(await bycrypt.compare(password, user.password)){
        if(!user.ban){
        req.session.user = true
        req.session.user = {
          id: user._id,
          name: user.name
        }
        const cart = await cartModel.findOne({user:user._id,method:'cart'})
        if(cart){
          req.session.user.cartID = cart._id
        }
        res.redirect('/')
        }else{
          const error = 'You are Banned!'
          res.render('user/userLogin',{error,failedAuth:failedAuthData})
        }
      }else{
        error = 'invalid email or password'
        res.render('user/userLogin',{error,failedAuth:failedAuthData})
      }
    }else{
      error = 'user NOT FOUND'
      res.render('user/userLogin',{error,failedAuth:failedAuthData})
    }
  },

  getUserRegister:(req, res) => {
    res.render("user/userSignUp");
  },

  submitOtp:(req,res)=>{
    const {email} = req.session.userDetails
    if(req.session.userDetails){
      res.render('user/submitOtp',{email})
    }else{
      res.redirect('/signUp')
    }
    
  },

  userRegister:async(req, res) => {
    const { name, email,} = req.body;

    const emailExist = await userModel.findOne({email})
    
    if(emailExist){
      const error  = 'Email already exists'
      return res.render('user/userSignUp',{error})
    }
    req.session.userDetails = req.body
    sendOtp(name,email,otp)
    req.session.email = email
    req.session.name = name
    req.session.otp = otp
    
    res.redirect('/submitOtp')
  },

  verifyOtp: async(req,res)=>{
    const {name, email, phone, password} = req.session.userDetails;
    const otpBody = req.body.otp.join('')
    if(req.session.otp == otpBody ){

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
      res.render('user/submitOtp',{error,email})
    }
  },

  resendOtp:(req,res)=>{
    req.session.otp = null
    otp = undefined
    otp = generateOtp()
    const email = req.session.email
    const name = req.session.name
    sendOtp(name,email,otp)
    req.session.otp = otp
    res.redirect('/submitOtp')
  },

  getEmailVerifyFP: async(req,res)=>{
    res.render('user/forgotPass/verifyEmail')
  },

  emailVerifyFP: async(req,res)=>{
    const {emailFP} = req.body
    const emailExist = await userModel.findOne({email:emailFP})
    if(emailExist){
      sendOtp(emailExist.name,emailFP,otp)
      req.session.email = emailFP
      req.session.name = emailExist.name
      req.session.otp = otp
      res.render('user/forgotPass/submitOtpFP',{emailFP})
    }else{
      const error = "user NOT FOUND"
      res.render('user/forgotPass/verifyEmail',{error})
    }
  },

  verifyOtpFP: async(req,res)=>{
    const emailFP = req.session.email
    const otpBody = req.body.otp.join('')
    if(req.session.otp == otpBody ){
      res.render('user/forgotPass/changePass')
    }else{
      const error = 'Incorrect OTP'
      res.render('user/forgotPass/submitOtpFP',{error,emailFP})
    }
  },

  changePassFP: async(req,res)=>{
    const email = req.session.email
    const password = req.body.password
    const hashPass = await bycrypt.hash(password,10)
    await userModel.findOneAndUpdate({email:email},{$set:{password:hashPass}})
    res.redirect('/login')
  },

  getAddAddress: async(req,res)=>{
    const user = await userModel.findById(req.session.user.id)
    res.render('user/addAddress',{user})
  },

  submitAddress: async(req,res)=>{
    await userModel.updateOne({_id:req.session.user.id},{
      $push:{
        address:req.body
      }
    })
    res.redirect(req.session.backURL)
  },

  getEditAddress: async(req,res)=>{
    const addressId = req.params.id
    const address = await userModel.findOne({_id:req.session.user.id,'address._id':addressId},{'address.$':1})
    res.render('user/editAddress',{address})
  },

  editAddress: async(req,res)=>{
    const addressId = req.params.id
    await userModel.updateOne({_id:req.session.user.id,'address._id':addressId},{
      $set:{
        'address.$':req.body
      }
    })
    res.redirect(req.session.backURL)
  },

  deleteAddress: async(req,res)=>{
    const addressId = req.params.id
    await userModel.updateOne({_id:req.session.user.id},{
      $pull:{
        address:{_id:addressId}
      }
    })
    res.redirect(req.session.backURL)
  },

  getEditInfo: async(req,res)=>{
    const user = await userModel.findOne({_id:req.session.user.id})
    res.render('user/edit-info',{user})
  },

  editInfo: async(req,res)=>{
    const {name,phone,email} = req.body
    await userModel.updateOne({_id:req.session.user.id},{
      $set:{
        name:name,
        phone:phone,
      }
    })
    console.log(req.body);
    res.redirect(req.session.backURL)
  },

};
module.exports = userController;

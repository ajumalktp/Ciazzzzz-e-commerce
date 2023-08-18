const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

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

  getSignUp: asyncHandler((req, res) => {
    res.render("userSignUp");
  }),
  signUp: asyncHandler((req, res) => {
    const { name, email, phone, password } = req.body;
    console.log(name);
    const user = new userModel({
      name: name,
      email: email,
      phone: phone,
      password: password,
    });
    user
      .save()
      .then((result) => {
          console.log(result);
          res.redirect("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }),
};
module.exports = userController;

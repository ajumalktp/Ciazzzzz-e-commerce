const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const userController = {
  getHome: asyncHandler(async(req, res) => {
    const users = await userModel.find().lean()
    console.log(users)
    res.render("userHome",{users});
  }),

  getLogin: asyncHandler((req, res) => {
    res.render("userLogin");
  }),

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

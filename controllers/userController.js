const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const userController = {
  getHome: asyncHandler((req, res) => {
    res.render("userHome");
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
        if (result) {
          console.log(result);
          res.redirect("/login");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }),
};
module.exports = userController;

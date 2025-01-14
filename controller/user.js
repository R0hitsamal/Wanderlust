const User = require("../models/user.js");
module.exports.signupGet = (req, res) => {
  res.render("user/signup");
};

module.exports.signupPost = async (req, res, next) => {
  try {
    let {email, username, password} = req.body;
    let newUSer = new User({email, username});
    let regiteredUser = await User.register(newUSer, password);
    req.logIn(regiteredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("flash", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.loginpGet = (req, res) => {
  res.render("user/login");
};

module.exports.loginPost = async (req, res) => {
  req.flash("flash", "Welcome back to Wanderlust");
  res.redirect(res.locals.redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("flash", "Logged out successfully! ");
    res.redirect("/listings");
  });
};

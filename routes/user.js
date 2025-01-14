const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware/middleware.js");
const {
  signupGet,
  signupPost,
  loginPost,
  logout,
  loginpGet,
} = require("../controller/user.js");

// Signup
router.get("/signup", signupGet);

router.post("/signup", wrapAsync(signupPost));

// Login
router.get("/login",loginpGet);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(loginPost)
);

// LogOut
router.get("/logout", logout);

module.exports = router;

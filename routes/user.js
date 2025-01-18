const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,saveRedirectUrl } = require("../middleware.js");
const multer = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));



router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);


router.get("/logout", userController.logout);

router.get("/profile/:id",isLoggedIn, userController.profile);

router.route("/profile/:id/edit")
.get(isLoggedIn, userController.renderEditForm)
.put(isLoggedIn,upload.single('profile[image]'),userController.profileUpdate);

module.exports = router;

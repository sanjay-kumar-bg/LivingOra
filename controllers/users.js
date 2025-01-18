const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password); 
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcom to LivingOra");
        res.redirect("/listings");
      });

    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to LivingOra");
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl); 
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => { 
      if (err) {
        return next(err);
      }
      req.flash("success", "You are loggedout now");
      res.redirect("/listings");
    });
};

module.exports.profile = async (req,res,next) => {
  let{id} = req.params;
  let user = await User.findById(id);
  
  res.render("users/profile.ejs",{user});
};

module.exports.renderEditForm = async (req,res,next) => {
  let{id} = req.params;
  let user = await User.findById(id);
  res.render("users/profileedit.ejs",{user});
};

module.exports.profileUpdate = async (req, res, next) => {
  try {
    let { id } = req.params; 
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;

      user.image = { url, filename };
      await user.save();
    }

    await User.findByIdAndUpdate(id, { ...req.body.profile });

    res.redirect(`/profile/${id}`);
  } catch (err) {
    next(err);
  }
};
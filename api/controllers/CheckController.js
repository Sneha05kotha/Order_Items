const passport = require("passport");
const User = require("../models/User");
// const { serializeUser } = require('passport');
module.exports = {
  login: function (req, res) {
    console.log("Did i just logged" + req.query.url);
    passport.authenticate("local", (err, user, info) => {
      if (err || !user) {
        return res.view("company-z/error", { errorMessage: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          res.send(err);
        }
        req.session.userId = user;
        return res.redirect(req.query.url);
      });
    })(req, res);
  },
  logout: function (req, res) {
    req.logout();
    req.session.userId = "";
    res.redirect("/");
  },
  register: function (req, res) {
    data = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    User.create(data)
      .fetch()
      .exec((err, user) => {
        console.log("Am i here???");

        if (err) {
          return res.negotiate(err);
        }
        if (user) {
          req.login(user, (err) => {
            if (err) {
              return res.negotiate(err);
            }
            sails.log("User" + user.id + "Has logged in");
            return res.view("company-z/view");
          });
        }
      });
  },
};

const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const stripe = require("stripe")("sk_test_LDUkMyvnlBlHJYwbaL12ZwYB");

module.exports = {
    signUp(req, res, next){
      res.render("users/sign_up");
    },

    create(req, res, next){
        //#1
        console.log("create a user");
        console.log(JSON.stringify(req.body));
             let newUser = {
        
       username: req.body.username,
       email: req.body.email,
       password: req.body.password,
       passwordConfirmation: req.body.password_conf
             };
        // #2
        console.log(JSON.stringify(newUser));
             userQueries.createUser(newUser, (err, user) => {
               if(err){
                 req.flash("error", err);
                 res.redirect("/users/sign_up");
               } else {
        
        // #3
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
          })
        }
      });
    },
    
    signInForm(req, res, next){
      res.render("users/sign_in");
    },


    signIn(req, res, next){
      passport.authenticate("local")(req, res, function () {
        if(!req.user){
          req.flash("notice", "Sign in failed.")
          res.redirect("/users/sign_in");
        } else {
          req.flash("notice", "Signed in!");
          res.redirect("/");
        }
      })
    },

    signOut(req, res, next){
      req.logout();
      req.flash("notice", "Signed out.");
      res.redirect("/");
    },
    upgradeForm(req, res, next){
      res.render("users/upgrade");
  },

  upgrade(req, res, next){
      const token = req.body.stripeToken;
      const charge = stripe.charges.create({
          amount: 60.0,
          currency: 'usd',
          description: 'premium account fee',
          source: token,
        });
      userQueries.upgradeUser(req, (err, user) => {
          if(err){
              req.flash("error", err);
              res.redirect("/users/upgrade");
          } else {
              console.log("successfully upgraded");
              req.flash("notice", "You've successfully upgraded to your account.");
              res.redirect("/");
          }
      });
    }
  }
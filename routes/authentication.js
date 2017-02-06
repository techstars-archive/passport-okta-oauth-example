var express = require('express');
var router = express.Router();
var passport = require('../config/passport')

var authenticateUser = passport.authenticate('okta', {
  successRedirect: '/users',
  failureRedirect: '/'
})

router.get('/login', passport.authenticate('okta', {
  successRedirect: '/users',
  failureRedirect: '/'
}));

router.get('/okta/callback', function(req, res, next){
  console.log("/okta/callback");

  passport.authenticate('okta', function(err, user, info) {
    if(req.query.error != undefined){
      console.log("Error");

      req.flash('errorCode', req.query.error);
      req.flash('errorMessage', req.query.error_description);
      res.redirect('/');
    } else {
      console.log("Success");
      console.log(user);
      console.log(info);

      req.logIn(user, function(err){
        req.flash('success', "Logged In Successfully");
        res.redirect('/users');
      });
    }

  })(req, res, next);
});

module.exports = router;
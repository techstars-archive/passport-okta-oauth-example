var passport = require('passport');
var OktaStrategy = require('passport-okta-oauth').Strategy;
var request = require('request');
var nconf = require('nconf');

// Configs
nconf.argv()
  .file({ file: './config/config.json'})
  .env();

// Strategy Config
passport.use(new OktaStrategy({
    audience:     nconf.get("OKTA_AUDIENCE"),
    clientID:     nconf.get("OKTA_CLIENTID"),
    clientSecret: nconf.get("OKTA_CLIENTSECRET"),
    idp:          nconf.get("OKTA_IDP"),
    scope: ['openid', 'email', 'profile'],
    response_type: 'code',
    callbackURL: "http://localhost:3000/auth/okta/callback"
  },
  function(accessToken, refreshToken, profile, done){
    done(null, profile)
  })
);

// Serialization
passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  // Fetch User Object from Database/App
  options = {
    method: 'get',
    url: nconf.get("OKTA_AUDIENCE") + "/api/v1/users/" + id,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "SSWS " + nconf.get("OKTA_API_KEY"),
    }
  }

  request(options, function(err, httpResponse, body){
    var profile = { provider: 'okta' };
    var json = JSON.parse(body);

    profile.id = json.id;
    profile.displayName = json.profile.firstName + " " + json.profile.lastName;
    profile.username = json.profile.login;
    profile.name = {
      fullName: profile.displayName,
      familyName: json.profile.lastName,
      givenName: json.profile.firstName
    };
    profile.emails = [{ value: json.profile.email }];

    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
});

module.exports = passport;
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.user.displayName);
  res.send('Welcome ' + req.user.displayName);
});

module.exports = router;

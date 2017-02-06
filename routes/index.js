var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.flash());

  var flash = req.flash();
  res.render('index', {
    title: 'Express',
    errorCode: flash.errorCode,
    errorMessage: flash.errorMessage
  });
});

module.exports = router;

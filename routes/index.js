var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/*', function(req, res) {
  res.render('index', { title: "Unix Timestamp: " + new Date().getTime().toString() });
});


module.exports = router;

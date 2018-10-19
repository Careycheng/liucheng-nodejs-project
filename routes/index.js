var express = require('express');
var router = express.Router();
var usersModel = require('../model/usersModel.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册页面
router.get('/register.html',function(req,res){
  res.render('register');
});
router.get('/login.html', function (req, res) {
  res.render('login');
});

module.exports = router;

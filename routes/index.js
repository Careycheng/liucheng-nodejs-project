var express = require('express');
var router = express.Router();
var usersModel = require('../model/usersModel.js');


//首页
router.get('/', function(req, res, next) {
  if (req.cookies.userName) {
    res.render('index', {
      userName:req.cookies.userName,
      NickName:req.cookies.Nickname,
      is_admin: parseInt(req.cookies.isAdmin) ? "(管理员)" : "(普通用户)"  
    });
  } else {
    res.redirect('login.html');
  }
});

//注册页面
router.get('/register.html',function(req,res){
  res.render('register');
});
//登录页面
router.get('/login.html', function (req, res) {
  res.render('login');
});


//用户管理页面
router.get('/user-manager.html', function(req,res) {

  if (req.cookies.userName && parseInt(req.cookies.isAdmin)) {
    let page = req.query.page || 1;
    let pageSize = req.query.pageSize || 5;

    usersModel.getUserList({
      page: page,
      pageSize: pageSize
    }, function (err, data) {
      if(err) {
        res.render('werror', err);
      } else {
        res.render('user-manager', {
          userName: req.cookies.userName,
          Nickname: req.cookies.Nickname,
          is_admin: parseInt(req.cookies.isAdmin) ? "(管理员)" : "(普通用户)",

          userList: data.userList,
          totalPage: data.totalPage,
          page: data.page
          
        });
      }
    });
  } else {
    res.redirect('/login.html');
  }
});


//手机管理页面
router.get('/moblie-manager.html', function (req, res){
  if (req.cookies.userName && parseInt(req.cookies.isAdmin)) {
    res.render('moblie-manager');
  } else {
    res.redirect('login.html');
  }
})


module.exports = router;

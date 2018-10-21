var express = require('express');
var router = express.Router();
const usersModel = require('../model/usersModel.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册处理
router.post('/register', function (req, res) {
  if (!/^\w{5,12}$/.test(req.body.userName)) {
    res.render('werror', { code: -1, msg: '用户名必须是5-12位字符' });
    return;
  }

  if (!/^\S{6,16}$/.test(req.body.Password)) {
    res.render('werror', { code: -1, msg: '密码必须是6-16位字符' });
    return;
  }
  if (req.body.Password != req.body.Repassword) {
    res.render('werror', { code: -1, msg: '密码必须与上次相符' });
    return;
  }

  usersModel.add(req.body,  function (err) {
    if (err) {
      res.render('werror', err);
    } else {
      res.redirect('/login.html');
    }

  })
});

//登录处理
router.post('/login', function(req, res) {
  usersModel.login(req.body, function(err, data) {
    if (err) {
      res.render('werror', err);
    } else {
      console.log('当前用户信息是', data);

      //写入cookie
      res.cookie('userName', data.userName, {
        maxAge: 1000 *60 * 1000000
      });

      res.cookie('Nickname', data.NickName, {
        maxAge: 1000 * 60 * 1000000
      });

      res.cookie('isAdmin', data.is_admin, {
        maxAge: 1000 * 60 * 1000000
      });

      res.redirect('/');
    }
  });
});

//退出登录
router.get('/sign_out', function (req,res) {
  res.clearCookie('userName');
  res.clearCookie('Nickname');
  res.clearCookie('isAdmin');
  res.send('<script>location.replace("/")</script>');

});



module.exports = router;

var express = require('express');
var router = express.Router();
const usersModel = require('../model/usersModel.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

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
module.exports = router;

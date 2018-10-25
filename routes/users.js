var express = require('express');
var router = express.Router();
const usersModel = require('../model/usersModel.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册处理
router.post('/register', function (req, res) {
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]{2,12}$/.test(req.body.userName)) {
    res.render('werror', { code: -1, msg: '用户名必须是2-12位字符' });
    return;
  }
  if (!(/^[\u4e00-\u9fa5a-zA-Z0-9_]{2,20}$/.test(req.body.Nickname) || req.body.Nickname == '')) {
    res.render('werror', { code: -1, msg: '昵称必须是2-20位字符' });
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
  if (!(/^1[34578]\d{9}$/.test(req.body.phone) ||req.body.phone == '')) {
    res.render('werror', {
      code: -1,
      msg: '手机号必须是11位数字组成的字符'
    })
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

router.get('/search', function (req,res) {
  var page = req.query.page || 1;
  var pageSize = req.query.pageSize || 5;
  let nickname = new RegExp(req.query.nickname);
  var nicknameUrl = req.query.nickname;
  console.log(nickname)
  if (req.query.nickname == '') {
    res.redirect('/user-manager.html');
  } else {
    usersModel.searchList({
      page: page,
      pageSize: pageSize,
      NickName: nickname
    }, function (err,data) {
      if (err) {
        res.render('werror', err);
      } else {
        res.render('user-manager', {
          userName: req.cookies.userName,
          Nickname: req.cookies.Nickname,
          is_admin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '(普通用户)',
          userList: data.userList,
          page: data.page,
          totalPage: data.totalPage,
          nicknameUrl: nicknameUrl
        });
      }
    });
  }
});

//修改操作
router.post('/update', function(req, res) {
  var page = req.query.page || 1;
  var pageSize = req.query.pageSize || 5;
  var nicknameUrl = req.query.nickname || '';
  usersModel.update({
    page: page,
    pageSize: pageSize,
    NickName: req.body.nickname,
    phone: req.body.phone,
    sex: req.body.sex,
    age:req.body.age,
    _id: req.body._id
  },function (err, data) {
    if (err) {
      res.render('werror', err);
    } else {
      res.render('user-manager', {
        userName: req.cookies.userName,
        Nickname: req.cookies.Nickname,
        is_admin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '(普通用户)',
        userList: data.userList,
        page: data.page,
        totalPage: data.totalPage,
        nicknameUrl: nicknameUrl
      });
    }
  })
});


//删除操作
router.get('/delete', function (req, res) {
  var page = req.query.page || 1;
  var pageSize = req.query.pageSize || 5;
  var nicknameUrl = req.query.nickname || ''; 
  usersModel.delete({
    page: page,
    pageSize:pageSize,
    _id: req.query._id
  }, function (err, data) {
    if (err) {
      res.render('werror', err);
    } else {
      console.log(1111);
      res.redirect('/user-manager.html?page='+page);
    }
  })
})


module.exports = router;

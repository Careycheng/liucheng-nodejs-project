var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var phoneModel = require('../model/phoneModel');
const upload = require('multer')({
    dest: 'G:/tmp/'
});

//新增手机操作
router.post('/add', upload.single('phoneImg'), function (req, res) {
    console.log("-------------------------------");
    console.log(req.body,req.file);
      fs.readFile(req.file.path, function (err, data) {
        // console.log(data);
        if (err) {
            console.log('读取文件失败');
            req.send({code: -1, msg: '新增手机失败'});
        } else {
            var dest_path = path.resolve(__dirname, '../public/phone', new Date().getTime() + req.file.originalname);
            var renameArr = dest_path.split('\\');
            var rename = renameArr[renameArr.length - 1];
            console.log()
            fs.writeFile(dest_path, data, function (err) {
                if (err) {
                    console.log('写入文件失败');
                    res.send({ code: -103, msg: '写入文件失败'});
                } else {
                    console.log('写入文件成功');
                    var phoneData = {
                        name: req.body.name,
                        brand: req.body.brand,
                        official_guide_price: req.body.official_guide_price,
                        recovery_price: req.body.recovery_price,
                        imgSrc: rename
                    };
                    phoneModel.add(phoneData,function (err) {
                        console.log(111)
                        if (err) {
                            console.log('保存失败');
                        } else {
                            console.log('保存数据成功');
                            res.send();
                        }
                    });
                }
            });
        }
    }); 
});

//查询数据的操作
router.get('/search', function (req, res) {
    let page = req.query.page || 1;
    let pageSize = req.query.pageSize || 3;
    phoneModel.search({
        page: page,
        pageSize: pageSize
    }, function(err,data) {
        if (err) {
            console.console.log('查询失败');
            res.send({code: -101, msg: '查询失败'});
            
        } else {
            console.log('查询成功');
            res.send({code: 1, msg: '查询成功', data: data});
        }
    });
});

//修改操作
router.post('/update', upload.single('PhoneImg'), function (req, res) {
    console.log("1111-------------------------------");
    console.log(req.body, req.file);
    res.send();
    fs.readFile(req.file.path, function (err, data) {
        // console.log(data);
        if (err) {
            console.log('修改操作读取文件失败');
            req.send({ code: -1, msg: '修改操作读取文件失败' });
        } else {
            var dest_path = path.resolve(__dirname, '../public/phone', new Date().getTime() + req.file.originalname);
            var renameArr = dest_path.split('\\');
            var rename = renameArr[renameArr.length - 1];
            console.log()
            fs.writeFile(dest_path, data, function (err) {
                if (err) {
                    console.log('修改操作写入文件失败');
                    res.send({ code: -103, msg: '修改操作写入文件失败' });
                } else {
                    console.log('修改操作写入文件成功');
                    var updateData = {
                        _id: req.body._Id,
                        name: req.body.Name,
                        brand: req.body.Brand,
                        official_guide_price: req.body.Official_guide_price,
                        recovery_price: req.body.Recovery_price,
                        imgSrc: rename
                    };
                    phoneModel.update(updateData, function (err) {
                        console.log('1119999999999999999999999999999999999999999')
                        if (err) {
                            console.log('保存失败');
                        } else {
                            console.log('保存数据成功');
                            res.send();
                        }
                    });
                }
            });
        }
    });
});


//删除操作
router.post('/delete', function (req, res) {
    console.log(req,"====================================================")
    var page = req.body.page || 1;
    var pageSize = req.body.pageSize || 3;
    phoneModel.delete({
        page: page,
        pageSize: pageSize,
        _id: req.body.id
    }, function (err, data) {
        if (err) {
            res.render('werror', err);
        } else {
            console.log(1111);
            res.redirect('/moblie-manager.html?page=' + page);
        }
    })
})

module.exports = router;

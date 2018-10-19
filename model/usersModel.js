const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const async = require('async');

const usersModel = {
    /**
     * 
     * @param {Object} data 
     * @param {Function} cb 
     */

    add(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败', err);
                cb({ code: -100, msg: '连接数据库失败' });
                return;
            };
            const db = client.db('Student_Management_System');

            let saveData = {
                userName: data.userName,
                Password: data.Password,
                NickName: data.Nickname,
                phone: data.phone,
                is_admin: data.isAdmin
            };
            console.log(saveData);

            async.series([
                function (callback) {
                    //查询是否已注册
                    db.collection('User').find({ userName: saveData.Username }).count(function (err, num) {
                        if (err) {
                            callback({ code: -101, msg: "查询用户是否失败" });
                        } else if (num !== 0) {
                            console.log('用户名已存在');
                            callback({ code: -102, msg: '用户名已存在' });
                        } else {
                            console.log('用户名可用');
                            callback(null);
                        }
                    });
                },

                function (callback) {
                    //查询表中所有记录的条数
                    db.collection('User').find().count(function (err, num) {
                        if (err) {
                            callback({ code: -101, msg: '查询表中所有记录条数失败' });
                        } else {
                            saveData._id = num + 1;
                            callback(null);
                        }
                    });
                },

                function (callback) {
                    //写入数据库操作
                    db.collection('User').insertOne(saveData, function (err) {
                        if (err) {
                            callback({ code: -101, msg: '写入数据库失败' });
                        } else {
                            callback(null);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    console.log('上面的3步操作可能出了问题', err);
                    cb(err);
                } else {
                    cb(null);
                }
                client.close();
            });
        })
    }
}
module.exports = usersModel;
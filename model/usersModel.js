const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const async = require('async');

const usersModel = {
    /**
     * 注册操作
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
            let sum = 0;
            async.series([
                function (callback) {
                    //查询是否已注册
                    db.collection('User').find({ userName: saveData.userName }).count(function (err, num) {
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

                //查询表中所有记录的条数
                function (callback) {
                    db.collection('User').find().count(function (err, num) {
                        if (err) {
                            callback({ code: -101, msg: '查询表中所有记录条数失败' });
                        } else if (num <= 0){
                            saveData._id = 1;
                            callback(null);
                        } else {
                            console.log('查询成功');
                            sum = num;
                            callback(null,num);
                        }
                    });
                },
                function(callback){
                    if (sum <= 0) {
                        saveData._id = 1;
                        callback(null);
                    } else {
                        db.collection('User').find().skip(sum - 1).toArray(function (err, data) {
                            if (err) {
                                callback({code: -101, msg: '查询最后一天数据失败'});
                            } else {
                                console.log(data[0]._id);
                                console.log(saveData);
                                saveData._id = data[0]._id + 1;
                                callback(null);
                            }
                        });
                    }
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
                console.log(result);
            });
        })
    },


    /**
     *
     *登录处理
     * @param {Object} data
     * @param {Function} cb
     */

    login(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cd({ code: -100, msg: '数据库连接失败' });
            } else {
                const db = client.db('Student_Management_System');

                db.collection('User').find({
                    userName: data.userName,
                    Password: data.Password
                }).toArray(function (err, data) {
                    if (err) {
                        console.log('查询数据库失败', err);
                        cb({ code: -101, msg: err });
                        client.close();
                    } else if (data.length <= 0) {
                        console.log('用户不存在');
                        cb({ code: -102, msg: '用户名或密码错误' });
                    } else {
                        console.log('用户可以登录');

                        cb(null, {
                            userName: data[0].userName,
                            NickName: data[0].NickName,
                            is_admin: data[0].is_admin
                        });
                    }
                    client.close();
                });
            }
        });
    },


    /**
     *
     *获取用户列表
     * @param {*} data
     * @param {*} cb
     */
    getUserList(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cd({ code: -100, msg: '连接数据库失败' });
            } else {
                var db = client.db('Student_Management_System');
                console.log(data.page)
                console.log(data.pageSize)

                var limitNum = parseInt(data.pageSize);
                var skipNum = data.page * data.pageSize - data.pageSize;
                async.parallel([
                    function (callback) {
                        db.collection('User').find().count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询数据库失败' });
                            } else {
                                callback(null, num);
                            }
                        });
                    },

                    function (callback) {
                        db.collection('User').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -101, msg: '查询数据库失败' });
                            } else {
                                callback(null, data);
                            }
                        });
                    }

                ], function (err, result) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, {
                            totalPage: Math.ceil(result[0] / data.pageSize),
                            userList: result[1],
                            page: data.page
                        });
                    }
                    client.close();
                });
            }
        })
    },


    /**
     *
     *搜索
     * @param {Object} data
     * @param {Function} cb
     */
    searchList(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败');
                cb({ code: -100, msg: '连接数据库失败' });
            } else {
                const db = client.db('Student_Management_System');
                const limitNum = parseInt(data.pageSize);
                const skipNum = data.page * data.pageSize - data.pageSize;
                async.parallel([
                    function (callback) {
                        db.collection('User').find({ NickName: data.NickName }).count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询匹配条数失败' });
                            } else {
                                callback(null, num);
                            }
                        })
                    },

                    function (callback) {
                        db.collection('User').find({ NickName: data.NickName }).limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                console.log('搜索匹配失败');
                                callback({ code: -101, msg: '搜索匹配失败' });
                            } else {
                                callback(null, data);
                            }
                        })
                    }
                ], function (err, result) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, {
                            totalPage: Math.ceil(result[0] / data.pageSize),
                            userList: result[1],
                            page: data.page
                        });

                    }
                })
            }
        })
    },
    /**
     * 修改操作
     * @param {Object} data 
     * @param {Function} cb 
     */
    update(data, cb) {
        MongoClient.connect(url, function (err, client) {
            console.log(data)
            if (err) {
                console.log('数据库连接失败');
                cb({ code: -100, msg: '连接数据库失败' });
            } else {
                const db = client.db('Student_Management_System');
                let updateData = {
                    NickName: data.Nickname,
                    phone: data.phone,
                    sex: data.sex,
                    age: data.age
                };
                const limitNum = parseInt(data.pageSize);
                const skipNum = data.page * data.pageSize - data.pageSize;
                async.series([
                    function (callback) {
                        db.collection('User').update({ '_id': parseInt(data._id) }, {
                            $set: {
                                NickName: data.NickName,
                                phone: data.phone,
                                sex: data.sex,
                                age: data.age
                            }
                        }, function (err) {
                            if (err) {
                                callback({ code: -101, msg: '修改数据库失败' });
                            } else {
                                callback(null);
                            }
                        })
                    },

                    function (callback) {
                        db.collection('User').find().count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询记录条数失败' });
                            } else {
                                callback(null, num);
                            }
                        });
                    },

                    function (callback) {
                        db.collection('User').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -101, msg: '查询分页的数据失败' });
                            } else {
                                callback(null, data);
                            }
                        })
                    }
                ], function (err, result) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, {
                            totalPage: Math.ceil(result[1] / data.pageSize),
                            userList: result[2],
                            page: data.page
                        });
                    }
                    client.close();
                });
            }
        })
    },

    /**
     *
     *删除操作
     * @param {Object} data
     * @param {Function} cb
     */
    delete(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('数据库连接失败');
                cb({ code: -100, msg: '数据库连接失败' });
            } else {
                const db = client.db('Student_Management_System');
                const limitNum = parseInt(data.pageSize);
                const skipNum = data.page * data.pageSize - data.pageSize;
                async.series([
                    function (callback) {
                        db.collection('User').deleteOne({ '_id': parseInt(data._id) }, function (err) {
                            if (err) {
                                console.log('删除数据失败')
                                callback({ code: -101, msg: '删除数据失败' });
                            } else {
                                console.log('删除成功');
                                callback(null);
                            }
                        });
                    },
                    //查询记录条数
                    function (callback) {
                        db.collection('User').find().count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询记录条数失败' });
                            } else {
                                callback(null, num);
                            }
                        });
                    },
                    //查询分页的数据
                    function (callback) {
                        db.collection('User').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -101, msg: '查询分页的数据失败' });
                            } else {
                                callback(null, data);
                            }
                        })
                    }
                ], function (err, result) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, {
                            totalPage: Math.ceil(result[1] / data.pageSize),
                            userList: result[2],
                            page: data.page
                        });
                    }
                    client.close();
                })
            }
        })
    }
}
module.exports = usersModel;
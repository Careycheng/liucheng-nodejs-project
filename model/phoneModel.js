const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const url = 'mongodb://127.0.0.1:27017';

const phoneModel = {

    /**
     *
     *
     * @param {Object} data
     * @param {Function} cb
     */
    add(data, cb) {
        console.log('=========================================')
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('数据库连接失败');
                cb({ code: -100, msg: '数据库连接失败' });
            } else {
                var db = client.db('Student_Management_System');
                let saveData = {
                    name: data.name,
                    brand: data.brand,
                    official_guide_price: data.official_guide_price,
                    recovery_price: data.recovery_price,
                    imgSrc: data.imgSrc
                };
                let phoneNum = 0;
                async.series([
                    //查询总条数
                    function (callback) {
                        db.collection('Phone').find().count(function (err, num) {
                            if (err) {
                                console.log('查询数据库失败');
                                callback({ code: -101, msg: '查询数据库失败' })
                            } else if (num <= 0) {
                                saveData._id = 1;
                                callback(null);
                            } else {
                                console.log('查询成功');
                                phoneNum = num;
                                callback(null, num);
                            }
                        })
                    },
                    //查询最后一条数据
                    function (callback) {
                        if (phoneNum <= 0) {
                            saveData._id = 1;
                            callback(null);
                        } else {
                            db.collection('Phone').find().skip(phoneNum - 1).toArray(function (err, data) {
                                if (err) {
                                    console.log('查询最后一条数据失败', err);
                                    callback({ code: -101, msg: '查询最后一条数据失败' });
                                } else {
                                    saveData._id = data[0]._id + 1;
                                    callback(null);
                                }
                            });
                        }
                    },

                    //插入数据
                    function (callback) {
                        db.collection('Phone').insertOne(saveData, function (err) {
                            if (err) {
                                console.log('插入数据库失败', err);
                                callback({ code: -101, msg: '插入数据库失败' });
                            } else {
                                console.log('插入成功');
                                callback(null);
                            }
                        });
                    }

                ], function (err, result) {
                    if (err) {
                        console.log('以上三个步骤出错了');
                        cb({ code: -101, msg: err });
                    } else {
                        console.log(result);
                        cb(null);
                    }
                    client.close();
                })
            }
        })
    },

    /**
     *
     *查询所有手机信息
     * @param {*} data
     * @param {*} cb
     */
    search(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: -100, msg: '数据库连接失败' });
            } else {
                console.log('数据库连接成功');
                const db = client.db('Student_Management_System');
                var limitNum = data.pageSize;
                var skipNum = data.page * data.pageSize - data.pageSize;
                async.parallel([
                    //查询总数量
                    function (callback) {
                        db.collection('Phone').find().count(function (err, num) {
                            if (err) {
                                console.log('查询总条数失败');
                                callback({ code: -101, msg: '查询总条数失败' });
                            } else {
                                console.log('查询总条数成功');
                                callback(null, num);
                            }
                        })
                    },

                    function (callback) {
                        //查询分页的数据
                        db.collection('Phone').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                console.log('查询分页数据失败');
                                callback({ code: -101, msg: '查询分页数据失败' });
                            } else {
                                console.log('查询成功');
                                callback(null, data);
                            }
                        })
                    }
                ], function (err, result) {
                    if (err) {
                        console.log('以上两个步骤出错了');
                        cb({ code: -101, msg: 'err' });
                    } else {
                        cb(null, {
                            totalPage: Math.ceil(result[0] / data.pageSize),
                            phoneList: result[1],
                            page: data.page
                        })
                    }
                    client.close();
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
            console.log('=============******************11111111================')
            console.log(data,'---------------------------------')
            if (err) {
                console.log('数据库连接失败');
                cb({ code: -100, msg: '连接数据库失败' });
            } else {
                const db = client.db('Student_Management_System');
               
                // console.log(req,'wofdsfssssssssssssssssssssssssssssssssssssssssssssssssssssss')
                let updataData = {
                    name: data.name,
                    brand: data.brand,
                    official_guide_price: data.official_guide_price,
                    recovery_price: data.recovery_price,
                    imgSrc: data.imgSrc
                };
                console.log(updataData,"324444444444444444444444444444444444444444444444")
                var limitNum = parseInt(data.pageSize);
                var skipNum = data.page * data.pageSize - data.pageSize;
                async.series([
                    function (callback) {
                        // console.log(callback,"222222222222222222222222222222222222222222222222")
                        db.collection('Phone').update({ '_id': parseInt(data._id) }, {
                            $set: updataData
                        }, function (err) {
                            if (err) {
                                callback({ code: -101, msg: '修改数据库失败' });
                            } else {
                                console.log('修改数据库成功')
                                callback(null);
                            }
                        })
                    },

                    function (callback) {
                        db.collection('Phone').find().count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询记录条数失败' });
                            } else {
                                callback(null, num);
                            }
                        });
                    },

                    function (callback) {
                        db.collection('Phone').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
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
                            phoneList: result[2],
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
            console.log(11111111111111111111111111111111111111111)
            if (err) {
                console.log('数据库连接失败');
                cb({ code: -100, msg: '数据库连接失败' });
            } else {
                const db = client.db('Student_Management_System');
                console.log('数据库连接成功');
                db.collection('Phone').deleteOne({'_id': parseInt(data._id)}, function (err) {
                    if (err) {
                        console.log('数据删除失败');
                        cb({code: -101, msg: '数据删除失败'});
                    } else {
                        console.log('数据删除成功');
                        cb(null);
                    }
                })
            }
        })
    }
}

module.exports = phoneModel;
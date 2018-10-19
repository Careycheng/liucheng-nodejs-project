const MongoClient = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';

MongoClient.connect(url,function (err,client) { 
    if (err) throw err;

    const db = client.db('Student_Management_System');

    db.collection('User').insertOne();
 })
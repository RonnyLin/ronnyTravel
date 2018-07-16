var app = getApp();
var Bmob = require('../utils/Bmob-1.6.1.min.js');
var utils = require('../utils/util.js');
var Question = require('../api/question.js');

module.exports = {
    getPesonalPost: function () {
        const query = Bmob.Query("post");
        query.equalTo("openid","==", app.globalData.userInfo.openid);
        return Q((resolve,reject)=>{
            query.find().then(res => {
                resolve(res)
            });
        })
    },
    getPosts: function (limit=10,skip) {
        const query = Bmob.Query("post");
        query.limit(limit);
        query.skip(skip);
        return Q((resolve,reject)=>{
            query.find().then(res => {
                resolve(res)
            });
        })
    },
    generateCode:function (opt) {
        let options = {
            path:opt.path,
            width:opt.width,
            interface:opt.interface || 'c',
            type:opt.type || 1,
        };
        return Q((resolve,reject)=>{
            Bmob.generateCode(options).then(function (res) {
                resolve(res);
            })
            .catch(function (err) {
                reject(err);
            });
        })
    },
    getMap:function () {
        const map = Bmob.Query("map");
        map.equalTo("openid","==", app.globalData.userInfo.openid);
        return Q((resolve,reject) =>{
            map.find().then(res => {
                resolve(res)
            });
        })
    }

};

function Q(caller) {
    let promise = new Promise(function (resolve, reject) {
        caller(resolve, reject);
    });
    return promise;
}
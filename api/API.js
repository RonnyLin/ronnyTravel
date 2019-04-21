var app = getApp();
var Bmob = require('../utils/Bmob-1.6.1.min.js');
var utils = require('../utils/util.js');
var Question = require('../api/question.js');


module.exports = {
    // 获取不同用户海报
    getUserPost:function (options) {
        const post = Bmob.Query("post");
        post.equalTo("openid","==", options.openid);
        post.order("-createdAt");
        return Q((resolve,reject)=>{
            post.find().then(res => {
                resolve(res)
            });
        })

    },

    // 获取所有海报
    getPosts: function (limit=10,skip) {
        const query = Bmob.Query("post");
        query.limit(limit);
        query.skip(skip);
        query.order("-createdAt");
        return Q((resolve,reject)=>{
            query.find().then(res => {
                resolve(res)
            });
        })
    },

    // 生成二维码
    generateCode:function (opt) {
        let options = {
            path:opt.path,
            width:opt.width,
            interface:opt.interface || 'a',
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

    // 获取地图
    getMap:function (options) {
        const map = Bmob.Query("map");
        map.equalTo("openid","==", options.openid);
        return Q((resolve,reject) =>{
            map.find().then(res => {
                resolve(res)
            });
        })
    },
    // 获取用户的计划
    getUserPlan:function (options) {
        const plan = Bmob.Query("plan");
        plan.equalTo("openid","==", options.openid);
        plan.order("-createdAt");
        return Q((resolve,reject) =>{
            plan.find().then(res => {
                resolve(res)
            });
        })
    },
    // 获取所有计划
    getPlan:function (limit=10,skip) {
        const plan = Bmob.Query("plan");
        plan.limit(limit);
        plan.skip(skip);
        plan.order("-createdAt");
        return Q((resolve,reject)=>{
            plan.find().then(res => {
                resolve(res)
            });
        })
    },

    // 获取用户的计划
    getUserAlbum:function (options) {
        const plan = Bmob.Query("album");
        plan.equalTo("openid","==", options.openid);
        plan.order("-createdAt");
        return Q((resolve,reject) =>{
            plan.find().then(res => {
                resolve(res)
            });
        })
    },
    // 获取所有计划
    getAlbum:function (limit=10,skip) {
        const plan = Bmob.Query("album");
        plan.limit(limit);
        plan.skip(skip);
        plan.order("-createdAt");
        return Q((resolve,reject)=>{
            plan.find().then(res => {
                resolve(res)
            });
        })
    },

    /* 设置 album 阅读 或者 点赞 +1
     * options.type { object } 存放想要修改的类型 key value
     */
    setAlbumPlus:function (options) {
        const album = Bmob.Query("album");
        let type = options.type || 'like';
        return Q((resolve,reject)=>{
            album.get(options.objectId).then(res => {
                res.increment(type);
                res.save().then(res =>{
                    resolve(res)
                })
            }).catch(err => {
                console.log(err)
            })
        })


    },

    // 设置 album_comment 点赞 +1
    setAlbumCommentLikePlus: function(options) {
        const plan = Bmob.Query("album_comment");
        let type = options.type || 'like';
        return Q((resolve,reject)=>{
            plan.get(options.objectId).then(res => {
                res.increment(type);
                res.save().then(res =>{
                    resolve(res)
                })
            }).catch(err => {
                console.log(err)
            })
        })

    },

    // 获取用户信息
    getUserInfo:function () {
        const wxuser = Bmob.Query("wxuser");
        wxuser.equalTo("openid","==", app.globalData.userInfo.openid);
        return Q((resolve,reject) =>{
            wxuser.find().then(res => {
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
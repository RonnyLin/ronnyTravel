//获取应用实例
const
    app = getApp(),
    Bmob = require('../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../utils/storage.js'),
    API = require('../../api/API.js'),
    utils = require('../../utils/util.js');

let date = utils.Getdate(new Date());
let timeout;

Page({
    data: {
        date:date,
        showTime:''
    },
    onLoad: function () {
        let me = this;
        setTimeout(()=>{
            //监听页面显示
            if(app.globalData.userInfo.avatarUrl){
                let totalTime = 3;
                let interval = setInterval(function () {
                    me.setData({
                        showTime: totalTime
                    },function () {
                        totalTime--;
                    })
                },1000);
                if(totalTime==1){
                    window.clearInterval(interval);
                }
                timeout = setTimeout(function () {
                    wx.switchTab({
                        url: '../main/index'
                    })
                },3000)
            }
        },2000)

    },
    onReady:function () {
        //监听页面初次渲染完成

    },
    onShow:function () {

    },
    onHide:function () {
        //监听页面隐藏
    },
    onPullDownRefresh: function() {
        console.log(1)
    },
    onReachBottom: function() {
        console.log(2)
    },
    getUserInfo(e){
        if(e.detail.errMsg=='getUserInfo:fail auth deny'){
            wx.showToast({
                title: '请授权进入',
                icon: 'none',
                duration: 3000
            })
            return;
        }
        //如果数据不存在
        if(!app.globalData.userInfo.avatarUrl){
            let options = {
                encryptedData: e.detail.encryptedData,
                errMsg: e.detail.errMsg,
                iv: e.detail.iv,
                rawData: e.detail.rawData,
                signature: e.detail.signature,
                avatarUrl: e.detail.userInfo.avatarUrl,
                city: e.detail.userInfo.city,
                country: e.detail.userInfo.country,
                gender: e.detail.userInfo.gender,
                language: e.detail.userInfo.language,
                nickName: e.detail.userInfo.nickName,
                province: e.detail.userInfo.province,
            };
            Object.assign(app.globalData.userInfo,options);
            Storage.set(app.globalData.userInfo.openid,app.globalData.userInfo);
            app.getUserInfoByStorage(app.globalData.userInfo,app);
        }
        clearTimeout(timeout);
        wx.switchTab({
            url: '../main/index'
        })
    },
    enter:function () {

    }
})



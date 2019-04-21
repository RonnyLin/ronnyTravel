//获取应用实例
const
    app = getApp(),
    Bmob = require('../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../utils/storage.js'),
    API = require('../../api/API.js'),
    utils = require('../../utils/util.js');

let date = utils.Getdate(new Date());
let timeout;
let me;
Page({
    data: {
        date:date,
        showTime:'',
        shareFlag:false,
        shareId:''
    },
    onLoad: function (options) {
        me = this;
        console.error(options);
        if(options.shareflag=='1' && options.objectId){
            me.data.shareFlag = true;
            me.data.shareId = options.objectId;
        }
        // if(options.openid){
        //     me.data.options = options;
        //     return;
        // }

    },
    onReady:function () {
        //监听页面初次渲染完成

    },
    onShow:function () {
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
                        if(totalTime==0){
                            clearInterval(interval);
                            me.setData({
                                showTime:''
                            })
                        }
                    })
                },1000);

                if(me.data.shareFlag){
                    timeout = setTimeout(function () {
                        wx.navigateTo({
                            url: `/pages/plan/joinPlan/index?shareId=${me.data.shareId}`
                        })
                    },3000)
                }else{
                    timeout = setTimeout(function () {
                        wx.switchTab({
                            url: '/pages/list/index'
                        })
                    },3000)
                }
            }
        },1000)
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
            app.getUserInfoByStorage(app.globalData.userInfo,app,function (data) {
                if(app.globalData.userInfo.openid){
                    clearTimeout(timeout);
                    if(me.data.shareFlag){
                        wx.navigateTo({
                            url: `/pages/plan/joinPlan/index?shareId=${me.data.shareId}`
                        })
                        return;
                    }
                    wx.switchTab({
                        url: '../list/index'
                    })
                }else {
                    wx.showToast({
                        title: '身份认证失败',
                        icon: 'none',
                        duration: 3000
                    })
                }
            });

        }else{
            clearTimeout(timeout);
            if(me.data.shareFlag){
                wx.navigateTo({
                    url: `/pages/plan/joinPlan/index?shareId=${me.data.shareId}`
                })
                return;
            }
            wx.switchTab({
                url: '../list/index'
            })
        }

    },
    enter:function () {

    }
})



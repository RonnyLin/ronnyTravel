//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

Page({
    data: { // 初始化页面渲染数据
        logs: [],
        src : '',
        username:'',
        openid:app.globalData.userInfo.openid
    },
    onLoad: function () {
        console.error(app.globalData.userInfo.avatarUrl);
        this.setData({
            src:app.globalData.userInfo.avatarUrl,
            username:app.globalData.userInfo.nickName
        })

    },
    onReady:function () {
        //监听页面初次渲染完成
    },
    onShow:function () {
        //监听页面显示
        wx.showTabBar();
        let me = this;

    },
    onHide:function () {
        //监听页面隐藏
    },
    onReachBottom:function () {
        //页面上拉触底事件的处理函数
    },
    onShareAppMessage:function () {
        //用户点击右上角转发
    },
    onPullDownRefresh:function () {
        //监听用户下拉动作
    },
    onShareAppMessage:function () {
        //用户点击右上角转发
        return {
            title: '回到你的旅行時光',
            path: '/pages/loading/index'
        }
    },
    viewTap:function () {
        this.setData({
            text: 'Set some data for updating view.'
        }, function() {
            // this is setData callback
        })
    },
    editEvent:function (e) {
        wx.navigateTo({
            url: `../userinfo/index`,
            success:function () {

            }
        });
    },
    editDiaryEvent:function (e) {
        wx.navigateTo({
            url: `../edit/index`,
            success:function () {

            }
        });
    },
    editMapEvent:function (e) {
        wx.navigateTo({
            url: `../addFootMap/index`,
            success:function () {

            }
        });
    },
    addPlan:function () {
        wx.switchTab({
            url: '/pages/list/index'
        })
    },
    getUserInfo: function(e) {
        // app.globalData.userInfo = e.detail.userInfo
        console.log(e);
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

        this.setData({
            src: e.detail.userInfo.avatarUrl,
            username:e.detail.userInfo.nickName
        })
    }
})

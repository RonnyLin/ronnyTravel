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
        openid:''
    },
    onLoad: function (options) {
        let me = this;
        me.setData({
            openid:options.openid
        })
        let wxuser =  Bmob.Query('wxuser');
        wxuser.equalTo("openid","==",options.openid);
        wxuser.find().then(res =>{
            console.error(res[0]);
            let data = res[0];
            // me.data.openid = data.openid;
            me.setData({
                src:data.avatarUrl||'',
                username:data.nickName||''
            })
        });
        // this.setData({
        //     src:app.globalData.userInfo.avatarUrl,
        //     username:app.globalData.userInfo.nickName
        // })

    },
    onReady:function () {
        //监听页面初次渲染完成
    },
    onShow:function () {
        //监听页面显示
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
        // return {
        //     title: '回到你的幸福時光',
        //     path: '../personal/index'
        // }
    },
    viewTap:function () {
        this.setData({
            text: 'Set some data for updating view.'
        }, function() {
            // this is setData callback
        })
    }

})

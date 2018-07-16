//获取应用实例
const
    app = getApp(),
    Bmob = require('../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../utils/storage.js'),
    API = require('../../api/API.js'),
    utils = require('../../utils/util.js');


Page({
    data: {

    },
    onLoad: function () {
        let me =this;
    },
    onReady:function () {
        //监听页面初次渲染完成
    },
    onShow:function () {
        //监听页面显示
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
    pagemove: function (event) {
    },
    onShareAppMessage:function () {
        //用户点击右上角转发
        return {
            title: '回到你的幸福時光',
            path: '../main/index'
        }
    }

})



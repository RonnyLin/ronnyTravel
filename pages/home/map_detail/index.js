//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

Page({
    data: {
        markers: [{
            iconPath: "/images/site.png",
            id: 0,
            latitude: 30.3413,
            longitude: 120.079,
            width: 20,
            height: 20,
            callout:{
                content:'hello',
                color:'#ff0000',
                display:'ALWAYS'

            },
            label:{
                content:'hello',
                color:'#00ff00'
            }
        }],
        polyline: [{
            points: [{
                longitude: 113.3245211,
                latitude: 23.10229
            }, {
                longitude: 113.324520,
                latitude: 23.21229
            }],
            color:"#FF0000DD",
            width: 2,
            dottedLine: true
        }]
    },
    onLoad: function (options) {
        wx.openLocation({
            latitude: Number(options.latitude),
            longitude: Number(options.longitude),
            scale: 14
        })
        // this.setData({
        //     latitude:options.latitude,
        //     longitude:options.longitude,
        //
        // })
        // 监听页面加载
    },
    onReady:function () {
        //监听页面初次渲染完成
        this.mapCtx = wx.createMapContext('myMap')

    },
    regionchange(e) {
        console.log(e)
    },
    markertap(e) {
        console.log(e.markerId)
    },

    click: function (e) {
        this.mapCtx.getCenterLocation({
            success: function(res){
                console.log(res.longitude)
                console.log(res.latitude)
                console.error(res);
                wx.openLocation({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    scale: 14
                })
            }
        })
    },
    getCenterLocation: function () {
        this.mapCtx.getCenterLocation({
            success: function(res){
                console.log(res.longitude)
                console.log(res.latitude)
            }
        })
    },

    onShow:function () {
        //监听页面显示
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
    pageToTest:function () {
        wx.navigateTo({
            url: '../testPage/index'
        })
    },
    onShareAppMessage:function () {
        return {
            title: '自定义转发标题',
            path: '/pages/index'
        }
    }


})

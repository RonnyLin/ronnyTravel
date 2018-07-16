//获取应用实例
const
    app = getApp(),
    Bmob = require('../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../utils/storage.js'),
    API = require('../../api/API.js'),
    utils = require('../../utils/util.js');

Page({
    data: { // 初始化页面渲染数据
        pages:[],
        flag: false
    },
    onLoad: function () {
    },
    onReady:function () {
        //监听页面初次渲染完成
    },
    onShow:function () {
        //监听页面显示
        let me = this;
        API.getPesonalPost().then(res =>{
            
            for (let i = 0;i<res.length;i++){
                res[i].post = JSON.parse(res[i].post);
            }
            console.error(res)
            if(res.length>0){
                me.setData({
                    pages:res  
                })
            } else {
                me.setData({
                    flag: true 
                })
            }
        })
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
            title: '回到你的幸福時光',
            path: '../personal/index'
        }
    },

    enter_detail:function (e) {
        console.log(e)
        let objectId = e.target.dataset.objectid
        if(objectId) {
            wx.navigateTo({
                url: `../detail/index?objectId=${objectId}`,
                success:function () {
                }
            });
        }
    }
})

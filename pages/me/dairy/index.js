//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

Page({
    data: { // 初始化页面渲染数据
        pages:[],
        flag: false,
        edit:false,
        options:{}
    },
    onLoad: function (options) {
        console.error(options)
        let me = this;
        if(options.openid){
            me.data.edit = true;
        }
        me.data.options = options;
        wx.showLoading({
            title: '加载中',
        })
    },
    onReady:function () {
        //监听页面初次渲染完成
    },
    onShow:function () {
        //监听页面显示
        let me = this;
        let options = me.data.options;

        if(!options.openid){
            options.openid = app.globalData.userInfo.openid
        }
        API.getUserPost(options).then(res =>{

            for (let i = 0;i<res.length;i++){
                res[i].post = JSON.parse(res[i].post);
            }

            if(res.length>0){
                let len = res.length;
                let time = len*300;
                me.setData({
                    pages:res
                },function () {
                    setTimeout(function(){
                        wx.hideLoading()
                    },time)
                })
            } else if(res.length==0){
                me.setData({
                    flag: true
                },function () {
                    wx.hideLoading()
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
        return {
            title: '回到你的旅行時光',
            path: '/pages/loading/index'
        }
    },
    onPullDownRefresh:function () {
        //监听用户下拉动作
    },


    editEvent:function (e) {
        wx.navigateTo({
            url: `../edit/index`,
            success:function () {

            }
        });
    },
    enter_detail:function (e) {
        console.log(e)
        let objectId = e.target.dataset.objectid;
        if(objectId) {
            wx.navigateTo({
                url: `../detail/index?objectId=${objectId}`,
                success:function () {
                }
            });
        }
    }
})

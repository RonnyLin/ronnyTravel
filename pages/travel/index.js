//获取应用实例
const
    app = getApp(),
    Bmob = require('../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../utils/storage.js'),
    API = require('../../api/API.js'),
    utils = require('../../utils/util.js');

Page({
    data: {
        questions:[],
        question:{},
        curNum:0,
        userAns:{}
    },
    onLoad: function () {
        let curNum = this.data.curNum;
        let questions = this.data.questions;
        questions = API.getQuestion();
        this.setData({
            questions:questions,
            question:questions[curNum]
        },function(){
            //设置完数据更新以后的回调函数
        })
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
    nextQuestion:function () {

    },
    radioChange: function(e) {
        let num = this.data.curNum;
        userAns[num] = e.detail.value;

        // this.setData({
        //     // userAns
        // })
        console.log('radio发生change事件，携带value值为：', e.detail.value)
    },

    nextQuestion:function () {
        wx.navigateTo({
            url: '../sharePage/index'
        })
    }
})



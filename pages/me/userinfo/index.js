//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

Page({
    data: { // 初始化页面渲染数据
        userInfo:{}
    },
    onLoad: function () {
        // 监听页面加载
    },
    onReady:function () {
        //监听页面初次渲染完成
    },
    onShow:function () {
        let me = this;
        API.getUserInfo().then(res =>{
            console.error(res)
            me.setData({
                userInfo:res[0]
            })

        })
        //监听页面显示
    },
    onHide:function () {
        //监听页面隐藏
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            'userInfo.birth': e.detail.value
        })
    },
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        let userData = {
            birth:e.detail.value.birth || '',
            wechat:e.detail.value.wechat || '',
            phone:e.detail.value.phone || '',
            sign:e.detail.value.sign|| ''
        }

        saveUserInfo(userData)
    },
    onReachBottom:function () {
        //页面上拉触底事件的处理函数
    },

    onPullDownRefresh:function () {
        //监听用户下拉动作
    }

})

function saveUserInfo(data) {
    const wxuser = Bmob.Query("wxuser");
    wxuser.equalTo("openid","==", app.globalData.userInfo.openid);
        wxuser.find().then(res => {
            console.log(res);
            if(res.length>0 && res[0]){
                wxuser.set('id', res[0].objectId);
                wxuser.set("birth",data.birth);
                wxuser.set("wechat",data.wechat);
                wxuser.set("phone",data.phone);
                wxuser.set("sign",data.sign);
                wxuser.save().then(res => {
                    console.log(res)
                    console.log('保存用户成功')
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 3000
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
        });
}



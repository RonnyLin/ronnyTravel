import { $wuxDialog } from '../../../component/index'

//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

let date = utils.Getdate(new Date());
let me;
Page({
    data: { // 初始化页面渲染数据
        date:date,
        dest :[],
        open:false,
        join:[]
    },
    onChange: function(e) {
        console.log(e.detail)
    },
    onScale: function(e) {
        console.log(e.detail)
    },
    onLoad: function () {
        // 监听页面加载
        me = this;
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
        // return {
        //     title: '自定义转发标题',
        //     path: '/pages/index'
        // }
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    add: function() {
        me.setData({
            open :true
        })
        const alert = (content) => {
            $wuxDialog('#wux-dialog--alert').alert({
                resetOnClose: true,
                title: '提示',
                content: content,
            })
        }

        $wuxDialog().prompt({
            resetOnClose: true,
            title: '请输入你想去的地方',
            content: '打开地图选择',
            fieldtype: 'text',
            defaultText: '',
            site:true,
            placeholder: '请输入你想去的地方',
            onConfirm(e, response) {
                console.error(response);
                if(response.length == 0 ){
                    const content =  `目的地不为空`;
                    alert(content);
                    me.setData({
                        open :false
                    })

                    return;
                }
                 me.data.dest.push(response);
                console.error(me.data.dest)
                me.data.open = false;
                me.setData({
                    dest:me.data.dest,
                    open :false
                })
            },
            onCancel(e){
                me.setData({
                    open :false
                })
            }
        })
    },
    reduce:function (e) {
        me.data.dest.pop();
        me.setData({
            dest:me.data.dest
        })

    },
    openSite:function (e) {
        let latitude = e.currentTarget.dataset.site[0];
        let longitude = e.currentTarget.dataset.site[1];
        if(!latitude){
            return
        }
        wx.openLocation({
            latitude: Number(latitude),
            longitude: Number(longitude),
            scale: 8
        })

    },
    formSubmit:function (e) {

        me.data.content = e.detail.value.content;
        me.data.title = e.detail.value.title;
        if(!me.data.content || !me.data.title || me.data.dest.length==0){
            wx.showToast({
                title: '完善的旅行信息，才行噢',
                icon: 'none',
                duration: 3000
            })
            return
        }
        let person = {
            name:app.globalData.userInfo.nickName,
            openid:app.globalData.userInfo.openid,
            avatarUrl:app.globalData.userInfo.avatarUrl,
            objectId:app.globalData.userInfo.objectId
        };
        me.data.join.push(person);

        // console.log('form发生了submit事件，携带数据为：', e.detail.value)
        let sendData = {
            date:me.data.date,
            dest:me.data.dest,
            content:me.data.content,
            title:me.data.title,
            join:me.data.join
        }
        savePlan(sendData)
    },
    save:function (e) {

    }
})

function savePlan(options) {
    wx.showLoading({
        title: '保存中',
    })
console.error(options)
    let plan =  Bmob.Query('plan');

    plan.set("openid",app.globalData.userInfo.openid);
    plan.set("author",app.globalData.userInfo.nickName);
    plan.set("avatarUrl",app.globalData.userInfo.avatarUrl);
    plan.set("title",options.title);
    plan.set("date",options.date);
    plan.set("dest",options.dest);
    plan.set("content",options.content);
    plan.set("join",options.join);

    plan.save().then(res => {
        console.log(res)
        console.log('插入计划成功')
        wx.hideLoading();
        wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 3000
        });
        wx.switchTab({
            url: `/pages/list/index`,
            success:function () {
            }
        })
    }).catch(err => {
        console.log(err)
        wx.hideLoading();

    })
}
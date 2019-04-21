//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

let me;
Page({
    data: {
        plan:{},
        objectId:'',
        pemission:0,
        imageBytes:'',
        ImageBytesFlag:false
    },
    onLoad: function (options) {
        me = this;
        me.data.objectId = options.objectId;
        me.data.pemission = options.pemission;
        let plan =  Bmob.Query('plan');
        plan.equalTo("objectId","==",options.objectId);
        plan.find().then(res =>{
            console.error(res)
            me.data.imageBytes = res[0].imageBytes;

            me.setData({
                plan:res[0],
                pemission:options.pemission,
                imageBytes:res[0].imageBytes || ''
            })

            //如果不存在二维码
            if(!me.data.imageBytes){
                API.generateCode(opt).then(res =>{
                    let plan =  Bmob.Query('plan');
                    plan.set('id',options.objectId);
                    plan.set('imageBytes',res.url);
                    plan.save().then(res =>{
                        console.error('插入成功')
                    }).catch(err => {
                        console.log(err)
                    })
                    me.data.imageBytes = res.url;
                    console.error(res);
                    me.setData({
                        imageBytes:res.url
                    })
                })
            }

        })

        let opt = {
            path:`/pages/loading/index?openid=${app.globalData.userInfo.openid}&shareflag=1&objectId=${me.data.objectId}`,
            width:190
        };


    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: `${app.globalData.userInfo.nickName}.邀你加入旅行:${me.data.plan.title}`,
            imageUrl:'http://bmob-cdn-20413.b0.upaiyun.com/2018/07/23/168e06a7402c02db80cbce3ad021ec6e.png',
            path: `/pages/loading/index?openid=${app.globalData.userInfo.openid}&shareflag=1&objectId=${me.data.objectId}`
        }
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
    watchMap:function (e) {
        console.error(e)
        let latitude = e.currentTarget.dataset.site[0];
        let longitude = e.currentTarget.dataset.site[1];
        //
        if(latitude) {
            // wx.navigateTo({
            //     url: `../map_detail/index?latitude=${latitude}&longitude=${longitude}`,
            //     success:function () {
            //     }
            // });
            wx.openLocation({
                latitude: Number(latitude),
                longitude: Number(longitude),
                scale: 14
            })
        }
    },
    watchUser:function (e) {
        console.error(e.currentTarget.dataset.openid)
        let openid = e.currentTarget.dataset.openid;
        if(openid) {
            wx.navigateTo({
                url: `/pages/home/user/index?openid=${openid}`,
                success:function () {
                }
            });
        }
    },
    sendImageBytes:function (e) {
        let flag = !me.data.ImageBytesFlag;
        me.setData({
            ImageBytesFlag:flag
        })
    }
})



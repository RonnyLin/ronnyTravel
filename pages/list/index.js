//获取应用实例
const
    app = getApp(),
    Bmob = require('../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../utils/storage.js'),
    API = require('../../api/API.js'),
    utils = require('../../utils/util.js');

let imgUrls = [
    {url:'http://bmob-cdn-20413.b0.upaiyun.com/2018/07/23/5b87659740a4e33e80cb55c4d395c559.png'},
    {url:'http://bmob-cdn-20413.b0.upaiyun.com/2018/07/23/4afbebe540d0d85080237b0e6f65b75d.png'},
    {url:'http://bmob-cdn-20413.b0.upaiyun.com/2018/07/23/062fc6a640b458688098d00699f9af1d.png'}
];
let me;
Page({
    data: {
        imgUrls:imgUrls,
        planList:[],
        initPage:false,
        _num:1,
        joinplan:[]
    },
    onLoad: function () {
         me =this;
    },
    onReady:function () {
        // const innerAudioContext = wx.createInnerAudioContext()
        // innerAudioContext.autoplay = true
        // innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46'
        // innerAudioContext.startTime=20;
        // innerAudioContext.onPlay(() => {
        //     console.log('开始播放')
        // })
        // innerAudioContext.onError((res) => {
        //     console.log(res.errMsg)
        //     console.log(res.errCode)
        // })
        //监听页面初次渲染完成
    },

    onShow:function () {
        //监听页面显示
        wx.showTabBar();
        API.getUserPlan({openid:app.globalData.userInfo.openid}).then(res =>{
            console.error(res)
            if(res.length>0){
                me.setData({
                    planList:res,
                    initPage:true
                })
                return
            }
            me.setData({
                initPage:true
            })
        })

        // 用户参与的计划
        const wxuser = Bmob.Query('wxuser');
        wxuser.field('joinplan',app.globalData.userInfo.objectId);
        wxuser.relation('plan').then(res =>{
            console.log(res);
            if(res.length>0){
                me.setData({
                    joinplan:res
                })
            }
        })
    },
    menuClick:function (e) {
        this.setData({
            _num:e.target.dataset.num
        })
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
    addPlan:function () {
        if(me.data.planList.length>2 && app.globalData.userInfo.vip ==0){
            wx.showToast({
                title: '你已经创建了，两个旅行计划，可联系客服，创建更多噢！',
                icon:'none',
                duration: 5000
            });
            return;
        }
        wx.navigateTo({
            url: `../plan/addPlan/index`,
            success:function () {
            }
        });
    },
    onShareAppMessage:function () {
        //用户点击右上角转发
        return {
            title: '回到你的旅行時光',
            path: '/pages/loading/index'
        }
    },
    seePlan:function (e) {
        let objectId = e.currentTarget.dataset.objectid;
        // 0 为游客 1为 创建者
        let pemission = e.currentTarget.dataset.pemission;
        if(objectId) {
            wx.navigateTo({
                url: `../plan/planDetail/index?objectId=${objectId}&pemission=${pemission}`,
                success:function () {
                }
            });
        }
    }

})



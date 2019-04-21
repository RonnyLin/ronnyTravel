//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

let dataFlag = 10;
Page({
    data: {
        pages:[],
        pageLen : 0,
        firstOpenFlag:false
    },
    onLoad: function () {
        let me =this;
        if(app.globalData.firstOpenFlag){
            me.setData({
                firstOpenFlag:app.globalData.firstOpenFlag
            })
        }
        me._getPost();
    },
    firstOpen:function () {
      this.setData({
          firstOpenFlag:false
      })
    },
    _getPost:function () {
        let me = this;
        API.getPosts(dataFlag,me.data.pageLen).then(res=>{
            for (let i = 0;i<res.length;i++){
                res[i].post = JSON.parse( res[i].post);
            }
            console.error(res)
            if(res.length>0){
                let arr = me.data.pages.concat(res);
                me.setData({
                    pages:arr
                },function () {
                    me.data.pageLen += dataFlag
                })
            }
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
            title: '回到你的旅行時光',
            path: '/pages/loading/index'
        }
    },
    watchUser:function (e) {
        console.error(e.currentTarget.dataset.openid)
        let openid = e.currentTarget.dataset.openid;
        if(openid) {
            wx.navigateTo({
                url: `../user/index?openid=${openid}`,
                success:function () {
                }
            });
        }
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
    change:function (e) {
        let me = this;
        console.error(e.detail.current)
        if(e.detail.current >me.data.pages.length-5){
            me._getPost();
        }
    },
    preview:function (e) {
        console.error(e.currentTarget.dataset.url)
        wx.previewImage({
            current: 'e.currentTarget.dataset.url', // 当前显示图片的http链接
            urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
        })
    }

})



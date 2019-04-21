//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');


let touchX = 0;//触摸时的原点
let touchY = 0;//触摸时的原点

let time = 0;//  时间记录，用于滑动时且时间小于1s则执行左右滑动
let interval = "";// 记录/清理 时间记录
let nth = 0;// 设置活动菜单的index
let nthMax = 5;//活动菜单的最大个数
let tmpFlag = true;// 判断左右华东超出菜单最大值时不再执行滑动事件
// let pages = [
//     {
//         cover:'http://bmob-cdn-19734.b0.upaiyun.com/2018/06/07/dc1797d940ccb8cd80fc54c434c75883.png',
//         title:'一生所爱',
//         author:'卢冠延',
//         content:'开始终结总是',
//         encode:'http://bmob-cdn-19734.b0.upaiyun.com/2018/06/07/dc1797d940ccb8cd80fc54c434c75883.png'
//     },
//     {
//         cover:'http://bmob-cdn-19734.b0.upaiyun.com/2018/06/07/dc1797d940ccb8cd80fc54c434c75883.png',
//         title:'哈哈',
//         author:'林润茏',
//         content:'天天监管机构好几个监管机构监管机构监管机构天天监管机构好几个监管机构监管机构监管机构天天监管机构好几个监管机构监管机构监管机构天天监管机构好几个监管机构监管机构监管机构天天监管机构好几个监管机构监管机构监管机构',
//         encode:'http://bmob-cdn-19734.b0.upaiyun.com/2018/06/07/dc1797d940ccb8cd80fc54c434c75883.png'
//     },
// ];

Page({
    data: {
        pages:[],
        curPage:0,
        nextPage:0,
        lastPage:0,
        send:0,
        page:{},
    },
    onLoad: function () {
        let me =this;

        var animation = wx.createAnimation({
            duration: 100,
            timingFunction: 'ease-out',
        })
        this.animation = animation;

        API.getPosts(200,this.data.send).then(res=>{
            for (let i = 0;i<res.length;i++){
                res[i].post = JSON.parse( res[i].post);
            }
            console.error(res)
            if(res.length>0){
                me.data.pages = res;
                me.setData({
                    page:me.data.pages[me.data.curPage]
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
            title: '回到你的幸福時光',
            path: '../main/index'
        }
    },

    pageend :function (e) {
        console.log(e);
        let me = this ;
        let curX = e.changedTouches[0].pageX;
        //下一页
        if(curX - touchX >= 60 && time <10){
            this.animationStart('left');
             this.data.curPage++;
             if(this.data.curPage<0||this.data.curPage>=this.data.pages.length){
                 me.data.curPage = 0;
                 // me.data.send +=10;
                 // me._getPages(me.data.send);
                 // return
             }
            let page = this.data.pages[this.data.curPage];
            setTimeout(function () {
                me.setData({
                    page:page
                },function () {
                    me.animationEnd('left');
                })
            },300)

            // 上一页
        }else if(curX - touchX <= -60 && time <10){
            this.animationStart('right');
            this.data.curPage--;
            if(this.data.curPage<0||this.data.curPage>=this.data.pages.length){
                this.data.curPage = this.data.pages.length-1;
            }
            let page = this.data.pages[this.data.curPage];
            setTimeout(function () {
                me.setData({
                    page:page
                },function () {
                    me.animationEnd('right');
                })
            },300)
        }
        clearInterval(interval); // 清除setInterval
        time = 0;
    },
    pagestart:function (e) {

        touchX = e.touches[0].pageX;
        touchY = e.touches[0].pageY;

        interval = setInterval(function(){
            time++;
        },100);

    },
    animationStart:function (e) {
        let systemInfo = app.globalData.systemInfo,
            width = app.globalData.systemInfo.windowWidth;

        if(e=='left'){
            this.animation.translateX(width).step();
        }else {
            this.animation.translateX(-width).step();
        }
        this.setData({
            animationData:this.animation.export()
        });
    },
    animationEnd:function (e) {
        let me = this;
        let systemInfo = app.globalData.systemInfo,
            width = app.globalData.systemInfo.windowWidth;
            setTimeout(function () {
                me.animation.translateX(0).step();
                me.setData({
                    animationData:me.animation.export()
                });
            },200)
    },
    // _getPages :function () {
    //     let me = this;
    //     API.getPosts(10,me.data.send).then(res=>{
    //         if(res.length ==0){
    //             me.data.send=0;
    //              return me._getPages(me.data.send);
    //         }
    //         for (let i = 0;i<res.length;i++){
    //             res[i].post = JSON.parse( res[i].post);
    //         }
    //         console.error(res)
    //         if(res.length>0){
    //             me.data.pages = res;
    //             me.setData({
    //                 page:me.data.pages[me.data.curPage]
    //             })
    //         }
    //     })
    // },

})



//获取应用实例
const
    app = getApp(),
    Bmob = require('../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../utils/storage.js'),
    API = require('../../api/API.js'),
    utils = require('../../utils/util.js'),
    wxApi = require('../../api/wxApi.js')
;


Page({
    data: { // 初始化页面渲染数据

    },
    onLoad: function (options) {
        let data = JSON.parse(options.data)
        console.error(data)
        this._draw(data)
    },
    onReady:function () {
        let me = this;
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
    onPullDownRefresh:function () {
        //监听用户下拉动作
    },
    onShareAppMessage:function () {
        //用户点击右上角转发
        return {
            title: '回到你的幸福時光',
            path: '../canvas/index'
        }
    },
    _draw:function (data) {
        let me = this;
        let systemInfo = app.globalData.systemInfo;
        let drawInfo = {
            width:app.globalData.systemInfo.windowWidth || 375,
            height: 250,
            pixelRatio:app.globalData.systemInfo.pixelRatio || 2,
        };
        //
        let imageInfo = data.imgInfo;
        let ctx = wx.createCanvasContext('myCanvas');

        // wxApi.getImageInfo({
        //     src: data.imgInfo.path
        //    }).then(res => {
        // //      console.error(res);
        // //
        //         let  imgInfo = {
        //             height:res.height,
        //             width:res.width,
        //             type:res.type,
        //             path:res.path
        //         }
        //
        //         me.data.formToSend.imgInfo = imgInfo;
        //
                drawInfo.height = (data.imgInfo.height * drawInfo.width)/(data.imgInfo.width);
        //         console.error(drawInfo);
        //
                    ctx.drawImage(imageInfo.path, 0, 0, drawInfo.width, drawInfo.height);
        //
               //文字
                ctx.setFillStyle('#000'); // 文字颜色：黑色
                ctx.setFontSize(10); // 文字字号：14px
                ctx.fillText(`${data.date}|${data.city}` ,20,drawInfo.height+20);

               //文字
                ctx.setFillStyle('#000'); // 文字颜色：黑色
                ctx.setFontSize(14); // 文字字号：14px
                ctx.fillText(data.title,20,drawInfo.height+50);
        //
                ctx.setFillStyle('#999'); // 文字颜色：黑色
                ctx.setFontSize(14); // 文字字号：14px
                ctx.fillText(data.author,20,drawInfo.height+70);
        //
                ctx.setFillStyle('#000'); // 文字颜色：黑色
                ctx.setFontSize(18); // 文字字号：18px
                let sectiongArr = data.section.split('\n');
                let maxFontNum = Math.floor((drawInfo.width-40)/18) || 20;
        //         // console.error(maxFontNum);
        //         // console.error(sectiongArr);
                let Allheight= drawInfo.height+80;
                sectiongArr.forEach((val,index,arr)=>{
                    let temp = val.StrCut2Arr(maxFontNum);
                    let sectiongIndex = index +1;
                    let sectiongArrTemp = [...temp];
                    sectiongArrTemp.forEach((e,i)=>{
                        Allheight += 20;
                        ctx.fillText(e,20,drawInfo.height+60+(sectiongIndex+i+1)*20);
                    })
                });
                //绘制二维码
                if(data.imageBytes){
                    ctx.drawImage(data.imageBytes, drawInfo.width-25-70, Allheight+80, 74, 74);
                }

                //绘制头像
                let avatarUrl = app.globalData.userInfo.avatarUrl;
                if(avatarUrl){
                    ctx.drawImage(avatarUrl, 20, Allheight+80+17, 40, 40);
                }
        //         //绘制微信名称
        //         let wxname = '@'+app.globalData.userInfo.nickName;
        // //
        //         ctx.setFillStyle('#999'); // 文字颜色：黑色
        //         ctx.setFontSize(12); // 文字字号：14px
        //         ctx.fillText(wxname,20,Allheight+80+40);
        //
                ctx.draw();
                wx.showToast({
                    title: '已保存，可截图',
                    icon: 'success',
                    duration: 4000
                })
                me.setData({
                    height:Allheight+200+'px'
                })
        //
        //         wx.hideLoading();
        //         me.setData({
        //             height: Allheight+200+'px',
        //             btn_height:Allheight+200+50+'px'
        //         },function () {
        //             wx.hideLoading();
        //             console.log(me.data.formToSend);
        //             //保存数据
        //             saveContent(me.data.formToSend);
        //             wx.showToast({
        //                 title: '已保存，可截图分享',
        //                 icon: 'success',
        //                 duration: 3000
        //             })
        //         })
        //     }) .catch(err =>{
        //         console.error(err);
        //         wx.hideLoading();
        //     })
    }
 });

function saveContent(data) {
    console.log(data)
}

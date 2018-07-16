//获取应用实例
const
    app = getApp(),
    Bmob = require('../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../utils/storage.js'),
    API = require('../../api/API.js'),
    utils = require('../../utils/util.js'),
    wxApi = require('../../api/wxApi.js'),
    QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
;
let qqmapsdk;
let date = utils.Getdate(new Date());

//拓展根据字符串长度分割的方法
String.prototype.StrCut2Arr=function(n){
    var str=this;
    var arr=[];
    var len=Math.ceil(str.length/n);
    for(var i=0;i < len;i++){
        if(str.length >= n){
            var strCut=str.substring(0,n);
            arr.push(strCut);
            str=str.substring(n);
        }else{
            str=str;
            arr.push(str);
        }
    }
    return arr;
};

Page({
    data: { // 初始化页面渲染数据
        openFlag:false,
        post:'http://bmob-cdn-19734.b0.upaiyun.com/2018/06/16/efee122340ba631b804af570bc39bc9b.png',
        author:'',
        imageBytes:'',
        city:app.globalData.userInfo.city,
        formToSend:{}
    },
    onLoad: function () {
        // 监听页面加载
        console.error(app.globalData.userInfo);

        this.setData({
            author:app.globalData.userInfo.nickName
        })

        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'VJIBZ-ONSK6-GLAS2-MXGDS-DARKO-K6BWI'
        });
    },
    onReady:function () {
        let me = this;
        //监听页面初次渲染完成
        let opt = {
            path:"pages/main/index",
            width:190
        };
        //如果不存在二维码
        if(!me.data.imageBytes){
            API.generateCode(opt).then(res =>{
                me.data.imageBytes = res.url;
                me.data.formToSend.imageBytes = res.url;
                console.error(res);
            })
        }
        // 获取用户定位
        //latitude 纬度  longitude经度
        wxApi.getLocation().then(res =>{
            console.error(res)
            // 调用接口
            qqmapsdk.reverseGeocoder({
                location: {
                    latitude: res.latitude,
                    longitude: res.longitude
                },
                success: function(res) {
                    console.log(res.result.ad_info.city);
                    me.data.formToSend.city = res.result.ad_info.city;
                    app.globalData.city = res.result.ad_info.city;

                    me.data.formToSend.date = date;

                    me.setData({
                        city:res.result.ad_info.city
                    })
                },
                fail: function(res) {
                    console.log(res);
                },
                complete: function(res) {
                    console.log(res);
                }
            });
        })
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
    takePhoto() {
        let me =this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

                let tempFilePaths = res.tempFilePaths;
                me.setData({
                    post:tempFilePaths[0]
                },function () {
                    me.changePhoto2();
                })
            }
        })
    },
    takeAlbulm() {
        let me = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                console.error(res);
                let tempFilePaths = res.tempFilePaths;
                me.setData({
                    post:tempFilePaths[0]
                },function () {
                    me.changePhoto2();
                })
            }
        })
    },
    closePhotoView(){
        this.setData({

        })
    },
    changePhoto:function (e) {
        // let flag = e.currentTarget.dataset.flag;
        this.setData({
            openFlag:true
        })
    },
    changePhoto2:function (e) {
        // let flag = e.currentTarget.dataset.flag;
        this.setData({
            openFlag:false
        })
    },
    onShareAppMessage:function () {
        //用户点击右上角转发
        return {
            title: '回到你的幸福時光',
            path: '../main/index'
        }
    },
    viewTap:function () {
        this.setData({
            text: 'Set some data for updating view.'
        }, function() {
            // this is setData callback
        })
    },
    formSubmit:function (e) {
        let me = this;
        Object.assign(me.data.formToSend,e.detail.value);
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },
    save:function () {
        let me =this;
        wx.showLoading({
            title: '上传中',
        })
        wxApi.getImageInfo({
            src: me.data.post
        }).then(res => {
            console.error(res);
            let imgInfo = {
                height: res.height,
                width: res.width,
                type: res.type,
                path: res.path
            }
            me.data.formToSend.imgInfo = imgInfo;


            let name = ''+Date.now()+Math.random()*10000+app.globalData.userInfo.nickName;
            let file = Bmob.File(name, imgInfo.path);
            file.save().then(res => {
                console.log(res);
                me.data.formToSend.post = res[0];
                saveContent(me.data.formToSend,function (bombres) {
                    console.error(bombres)
                    // let objectId = JSON.stringify(bombres.objectId);
                    let objectId = bombres.objectId;

                    wx.navigateTo({
                        url: `../detail/index?objectId=${objectId}`,
                        success:function () {
                            wx.hideLoading();
                        }
                    });
                });
            })


        }).catch(e =>{
            console.error(e)
            wx.showToast({
                title: '请更改封面',
                icon: 'none',
                duration: 3000
            })
            // wx.hideLoading();

        })
    }


});

function saveContent(data,cal) {
    console.log(data);
    const post =  Bmob.Query('post');

    post.set('openid',app.globalData.userInfo.openid);
    post.set('nickName',app.globalData.userInfo.nickName);
    post.set('avatarUrl',app.globalData.userInfo.avatarUrl);
    post.set('date',data.date);
    post.set('city',data.city);
    post.set('imageBytes',data.imageBytes);
    post.set('author',data.author);
    post.set('imgInfo',JSON.stringify(data.imgInfo));
    post.set('post',data.post);
    post.set('section',data.section);
    post.set('title',data.title);
    post.save().then(res =>{
        cal(res);
  })
}

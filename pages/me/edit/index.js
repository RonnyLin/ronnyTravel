//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js'),
    wxApi = require('../../../api/wxApi.js'),
    QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js')
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
        // imageBytes:'',
        site:app.globalData.userInfo.city,
        formToSend:{}
    },
    onLoad: function () {
        let me = this;
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
        //询问用户是否已经 授权地理位置
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success() {
                            // 用户已经同意小程序使用地理位置，后续调用 wx.startRecord 接口不会弹窗询问
                            // 获取用户定位
                            //latitude 纬度  longitude经度
                            me._getLocation()
                        }
                    })
                } else {
                    me._getLocation();
                }
            }
        })
        // me._getLocation();

    },
    onShow:function () {
        //监听页面显示

    },
    _getLocation:function () {
        let me = this;
        wxApi.getLocation().then(res =>{
            console.error(res);
            //保存经纬度
            me.data.formToSend.latitude = res.latitude;
            me.data.formToSend.longitude = res.longitude;
                    // 调用接口
            qqmapsdk.reverseGeocoder({
                location: {
                    latitude: res.latitude,
                    longitude: res.longitude
                },
                success: function(res) {
                    console.log(res);
                    me.data.formToSend.site = res.result.address;
                    app.globalData.site = res.result.address;

                    me.data.formToSend.date = date;

                    me.setData({
                        site:res.result.address
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
    chooseSite(){
        let me = this;
        wx.chooseLocation({
            latitude: me.data.formToSend.latitude,
            longitude: me.data.formToSend.longitude,
            scale: 16,
            success:(res) =>{
                me.data.formToSend.latitude = res.latitude;
                me.data.formToSend.longitude = res.longitude;

                let siteArr = res.address.split('市');
                console.error(siteArr);
                me.data.formToSend.site = siteArr[0] +'  '+res.name;

                me.setData({
                    site:siteArr[0] +'  '+res.name
                })
                console.error(res)
            }
        })
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
    viewTap:function () {
        this.setData({
            text: 'Set some data for updating view.'
        }, function() {
            // this is setData callback
        })
    },
    formSubmit:function (e) {
        let me = this;
        if(!e.detail.value.title || !e.detail.value.author || !e.detail.value.section){
            wx.showToast({
                title: '请耐心的完善内容噢',
                icon: 'none',
                duration: 3000
            })
            return;
        }
        Object.assign(me.data.formToSend,e.detail.value);
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        me.save();
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
    post.set('date',data.date || '');
    post.set('site',data.site || '');
    post.set('latitude',data.latitude || 0);
    post.set('longitude',data.longitude ||0);
    // post.set('imageBytes',data.imageBytes);
    post.set('author',data.author);
    post.set('imgInfo',JSON.stringify(data.imgInfo));
    post.set('post',data.post);
    post.set('section',data.section);
    post.set('title',data.title);
    post.save().then(res =>{
        cal(res);
  })
}

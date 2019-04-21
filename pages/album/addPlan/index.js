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
        fileList: [],
    },
    onSuccess(e) {
        let me = this;
        console.log('onSuccess', e)
        me.data.fileList = e.detail.fileList
    },

    onRemove(e) {
        let me = this;
        console.log('onRemove', e)
        me.data.fileList.splice(e.detail.index,1);
        console.log('fileList', me.data.fileList)

    },
    onPreview(e) {
        console.log('onPreview', e)
        const { file, fileList } = e.detail
        wx.previewImage({
            current: file.url,
            urls: fileList.map((n) => n.url),
        })
    },
    formSubmit: function(e) {
        let me =this;
        wx.showLoading({
            title: '上传中',
        })
        console.error(e.detail.value);
        let form = e.detail.value;
        if(me.data.fileList && me.data.fileList.length > 0){
            let file
            for(let item of me.data.fileList){
                console.error(item)
                file = Bmob.File(item.url, item.url);
            }
            file.save().then(res => {
                console.log(res.length);
                form.post = res;
                saveContent(form, function (data) {
                    console.error(data);
                    if(data.success){
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            duration: 3000
                        })
                    }else{
                        wx.showToast({
                            title: '发布失败',
                            icon: 'none',
                            duration: 3000
                        })
                    }
                    wx.hideLoading();
                })

            })
            return;
        }

        saveContent(form, function (data) {
            console.error(data);
            if(data.success){
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 3000
                })
                console.error('发布成功')
            }else{
                wx.showToast({
                    title: '发布失败',
                    icon: 'none',
                    duration: 3000
                })
                console.error('发布失败')
            }
            wx.hideLoading();
        })
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
    }

})

function saveContent(form, cal) {
    const album =  Bmob.Query('album');

    album.set('openid',app.globalData.userInfo.openid);
    album.set('nickName',app.globalData.userInfo.nickName);
    album.set('avatarUrl',app.globalData.userInfo.avatarUrl);

    album.set('author',app.globalData.userInfo.nickName);
    album.set('name',form.name);
    album.set('post',form.post|| []);
    album.set('content',form.content);
    album.set('contact',form.contact);

    album.set('like',0);
    album.set('read',0);

    album.save().then(res =>{
        res.success = true;
        cal(res);
    }).catch(err =>{
        err.success = false;
        cal(err);
    })
}
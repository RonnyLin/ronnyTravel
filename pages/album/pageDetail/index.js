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
        fileList: {},
        InputOptions:{},
        objectId:'',
        comments:[],
        likes:[],
        like:false,
        replayComment:{},
        focus:false
    },

    onLoad: function (options) {
        // 监听页面加载
        me = this;
        me.data.objectId = options.objectId;
        me.data.type = options.type;

        let page =  Bmob.Query(me.data.type);
        page.equalTo("objectId","==",me.data.objectId);
        page.find().then(res =>{
            let options = {
                ...res[0]
                ,post:res[0].post.map(v => JSON.parse(v)['url']),createdAt:res[0].createdAt.slice(0,10)
            }
            let inputOptions = {
                type:me.data.type,
                objectId:me.data.objectId
            };
            me.data.InputOptions = inputOptions;

            if(res){
                me.setData({
                    fileList:options
                })
            }
        })

        let comment =  Bmob.Query(me.data.type+ '_comment');
        comment.equalTo("aId","==",me.data.objectId);
        comment.find().then(res =>{
            console.error(res)
            me.setData({
                comments:res
            })
        })

        let like = Bmob.Query(me.data.type+ '_like');
        like.equalTo("aId","==",me.data.objectId);
        like.find().then(res =>{
            console.error(res)
            let idx = res.findIndex((v)=>{
                return v.openid == app.globalData.userInfo.openid
            })


            me.setData({
                likes:res,
                like: idx>-1
            })
        })

        //根据options type 去查询对应的表
        console.error(options);
    },
    onMyPublish:function (e) {
        let comment =  Bmob.Query(me.data.InputOptions.type+'_comment');

        comment.set('openid',app.globalData.userInfo.openid);
        comment.set('userName',app.globalData.userInfo.nickName);
        comment.set('avatarUrl',app.globalData.userInfo.avatarUrl);
        // 文章id
        comment.set('aId',me.data.InputOptions.objectId);
        comment.set('content',e.detail.content);

        comment.set('like',0);
        comment.set('reply',{});

        let temp_arr = Object.keys(e.detail.replayComment);
        if(!!temp_arr){
            comment.set('reply',e.detail.replayComment);
        }

        comment.save().then(res =>{
            let len = me.data.comments.length;

            let opts = {
                openid:app.globalData.userInfo.openid,
                userName:app.globalData.userInfo.nickName,
                avatarUrl:app.globalData.userInfo.avatarUrl,
                aId:me.data.InputOptions.objectId,
                content:e.detail.content,
                like:0,
                reply:!!temp_arr?e.detail.replayComment :{},
                objectId:len
            }
             me.data.comments[len] = opts;
             if(!me.data.comments)return;
            me.setData({
                comments: me.data.comments
            },function () {
                wx.showToast({
                    title: '发表成功',
                    icon: 'success',
                    duration: 3000
                })
            })
        }).catch(err =>{
            console.error(err)
        })

    },
    onReplyComment:function (e) {
      let replayComment = e.detail;
      me.commentInput.replayfocus();
      me.setData({
          replayComment:replayComment
      })
    },
    refreshComments:function (e) {
        if(!!e.detail.length){
            me.data.comments = e.detail;
        }
    },
    onMyBlur:function (e) {
        console.error(e);
        me.setData({
            focus:false
        })
    },
    onMyFocus:function (e) {
        console.error(e);
        me.setData({
            focus:true
        })
    },
    onMyLike:function (e) {
        console.error(e);
        let like =  Bmob.Query(me.data.InputOptions.type+'_like');

        like.set('openid',app.globalData.userInfo.openid);
        like.set('userName',app.globalData.userInfo.nickName);
        like.set('avatarUrl',app.globalData.userInfo.avatarUrl);
        // 文章id
        like.set('aId',me.data.InputOptions.objectId);

        like.save().then(res =>{

        })
    },
    onMyShare:function (e) {
        console.error(e);
    },
    onMyErweima:function (e) {
        console.error(e);
    },
    onReady:function () {
        //监听页面初次渲染完成
        me.commentInput = this.selectComponent('#comment_input')
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

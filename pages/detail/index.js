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
        post:{},
        title:'',
        section:'',
        author:'',
        avatar:'',
        imageBytes:'',
        city:app.globalData.city,
        date:''
    },
    onLoad: function (options) {
        let post =  Bmob.Query('post');
        post.equalTo("objectId","==",options.objectId);
        post.find().then(res =>{
            console.error(res[0]);
            let data = res[0];
            let poster = JSON.parse(data.post)

            var str = data.section;
            let sectiongArr = str && str.split('\n');

            console.error(sectiongArr);

            this.setData({
                title:data.title||'',
                post:poster||'',
                section:sectiongArr||[],
                author:data.author||'',
                avatar:data.avatarUrl||'',
                imageBytes:data.imageBytes||'',
                city:data.city||'',
                date:data.date||''
            })
        });
    },
    onReady:function () {
        let me = this;

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
    }
 });

function saveContent(data) {
    console.log(data)
}

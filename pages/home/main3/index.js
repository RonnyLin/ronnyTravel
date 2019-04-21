//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

let me;
let images_temple = [
    {page:'/pages/plan/addPlan/index',src:'/images/alert/travel.png',text:'发布旅行'},
    {page:'/pages/album/addPlan/index', src:'/images/alert/book.png',text:'书籍'},
    {page:'/pages/me/edit/index',src:'/images/alert/edit.png',text:'便利贴'},
    {page:'/pages/album/addPlan/index',src:'/images/alert/album.png',text:'旅行足跡'}
];

let posterPage = {pageUrl:'/pages/album/pageDetail/index',objectId:'',type:''};

let listPage = {pageUrl:'/pages/album/pageDetail/index',objectId:'',type:''};

Page({
    data: {
        current: 'tab1',
        visible: false,
        scrollHeight:'200px',
        posters:[],
        lists:[],
        planStatus:{
            isLoad:false,
            isEnd:false
        },
        albumStatus:{
            isLoad:false,
            isEnd:false
        },
        images_temple:images_temple
    },
    onLoad: function () {
        me = this;
        me.setData({
            scrollHeight:app.globalData.systemInfo.windowHeight - 96 + 'px'
        })

    },
    initStatus(){
        this.setData({
            lists:[],
            posters:[],
            planStatus:{isPlanLoad:false,isEnd:false},
            albumStatus:{isPlanLoad:false,isEnd:false}
        })
    },
    getPlanList(limit, skip){
        if(this.data.planStatus.isEnd){
            return;
        }
        this.setData({
            'planStatus.isLoad':true
        })

        API.getPlan(limit,skip).then(e =>{
            if(e.length === 0){
                me.setData({
                    'planStatus.isLoad':false,
                    'planStatus.isEnd':true
                })
                return;
            }
            let arrNew = e.map((val,index,arr) =>{
                return Object.assign({...val},{
                    comment: val.comment || [],
                    title:val.title,
                    has_image:!!val.imageBytes,
                    userName:val.author,
                    avatar:val.avatarUrl,
                    imageUrl:val.imageBytes,
                    updateTime:val.updatedAt,
                    page:{...listPage,objectId:val.objectId,type:'plan'}
                })
            })
            let lists = me.data.lists.concat(arrNew);
            setTimeout(()=>{
                me.setData({
                    lists: lists,
                    'planStatus.isLoad':false
                })
            },500)

        })
    },

    getAlbumList(limit, skip){
        // 如果已经加载完了直接返回
        if(this.data.albumStatus.isEnd){
            return;
        }
        this.setData({
            'albumStatus.isLoad':true
        })
        API.getAlbum(limit,skip).then(e =>{
            if(e.length === 0){
                me.setData({
                    'albumStatus.isLoad':false,
                    'albumStatus.isEnd':true
                })
                return;
            }
            let arrNew = e.map((val,index,arr) =>{
                return Object.assign({...val},{
                    content: val.content,
                    title:val.name,
                    author:val.author,
                    has_image:!!val.post.length,
                    imgUrl:val.post.length>0 ? JSON.parse(val.post[0])['url'] : '',
                    time:val.updatedAt,
                    page:{...posterPage,objectId: val.objectId, type:'album'}
                })
            })
            console.error(arrNew);
            let posters = me.data.posters.concat(arrNew);

            setTimeout(()=>{
                me.setData({
                    posters: posters,
                    'albumStatus.isLoad':false
                })
            },500)
        })
    },
    onReachBottom(e){

        if(me.data.current == 'tab1' && !me.data.planStatus.isEnd){
                me.getPlanList(10,me.data.lists.length);
        }else if(me.data.current == 'tab2' && !me.data.albumStatus.isEnd){
                me.getAlbumList(10,me.data.posters.length);
        }
    },
    onReady:function () {
        //监听页面初次渲染完成
    },
    onShow:function () {
        //监听页面显示
        wx.showTabBar();
        me.initStatus();
        me.getPlanList(10,me.data.lists.length);
        me.getAlbumList(10,me.data.lists.length);
    },
    onHide:function () {
        //监听页面隐藏
    },
    onChange(e) {
        console.log('onChange', e)
        console.log(e);
        this.setData({
            current: e.detail.key,
        })
    },
    open() {
        wx.hideTabBar();
        this.setData({
            visible: true,
        },function () {
        })
    },
    onClose() {
        wx.showTabBar();
        this.setData({
            visible: false,
        },function () {
        })
    },
    enter_page:function (e) {
        console.log(e)
        let pageUrl = e.currentTarget.dataset.pageurl;
        if(pageUrl) {
            wx.navigateTo({
                url: `${pageUrl}`,
                success:function () {
                    me.setData({
                        visible: false,
                    })
                }
            });
        }
    }
})



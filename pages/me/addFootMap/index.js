import china from './china2.js';

//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');
var that;
var myData =[];
// picker 初始化第二列的数据
let regular = [
    {"name":"北京", "log":"116.46", "lat":"39.92"},
    {"name":"平谷", "log":"117.1", "lat":"40.13"},
    {"name":"密云", "log":"116.85", "lat":"40.37"},
    {"name":"顺义", "log":"116.65", "lat":"40.13"},
    {"name":"通县", "log":"116.67", "lat":"39.92"},
    {"name":"怀柔", "log":"116.62", "lat":"40.32"},
    {"name":"大兴", "log":"116.33", "lat":"39.73"},
    {"name":"房山", "log":"115.98", "lat":"39.72"},
    {"name":"延庆", "log":"115.97", "lat":"40.47"},
    {"name":"昌平", "log":"116.2", "lat":"40.22"}
];

Page({
    data: { // 初始化页面渲染数据
        multiIndex:[0,0],
        multiArray: [
            [
                {name: '北京市'},
                {name: '上海市'},
                {name: '天津市'},
                {name: '重庆市'},
                {name: '河北省'},
                {name: '山西省'},
                {name: '辽宁省'},
                {name: '吉林省'},
                {name: '黑龙江省'},
                {name: '浙江省'},
                {name: '福建省'},
                {name: '山东省'},
                {name: '河南省'},

                {name: '湖北省'},
                {name: '湖南省'},
                {name: '广东省'},
                {name: '海南省'},
                {name: '四川省'},
                {name: '贵州省'},
                {name: '云南省'},
                {name: '江西省'},
                {name: '陕西省'},
                {name: '青海省'},
                {name: '甘肃省'},
                {name: '广西壮族自治区'},
                {name: '新疆维吾尔自治区'},
                {name: '内蒙古自治区'},
                {name: '西藏自治区'},
                {name: '宁夏回族自治区'},
                {name: '中国台湾'},
                {name: '中国香港'},
                {name: '中国澳门'},
                {name: '安徽省'},
                {name: '江苏省'}
            ], regular
        ],
        objectMultiArray:china,
        selected:regular,
        myData:myData
    },
    onLoad: function () {
        // 监听页面加载
        that = this;
    },
    onReady:function () {
        //监听页面初次渲染完成
    },
    onShow:function () {
        let me = this;
        //监听页面显示
        API.getMap({openid:app.globalData.userInfo.openid}).then(res =>{
            if(res.length != 0){
                myData = res[0].myData||[];
                me.setData({
                    myData:myData
                })
            }
        })
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
        //用户点击右上角转发
        return {
            title: '回到你的旅行時光',
            path: '/pages/loading/index'
        }
    },
    bindMultiPickerChange: function(e){
        let obj = that.data.selected[e.detail.value[1]];
        console.log(obj)
        let setObj = {
            name:obj.name,
            value:[Number(obj.log),Number(obj.lat)]
        };
        console.error(myData)
        let idx = myData.findIndex(e =>{
            return (e.name == setObj.name)
        })
        if(idx == -1){
            myData.push(setObj);
            that.setData({
                myData:myData
            })
        }else{
            wx.showToast({
                title: '你已经去过啦',
                icon: 'none',
                duration: 2000
            })
        }
    },
    bindMultiPickerColumnChange: function (e){
        console.log(e)
        switch (e.detail.column){
            case 0:
                for (var i = 0; i < that.data.objectMultiArray.length;i++){
                    if (that.data.objectMultiArray[i].name == that.data.objectMultiArray[e.detail.value].name){
                        that.data.selected = that.data.objectMultiArray[i].children
                    }
                }
                that.setData({
                    "multiArray[1]": that.data.selected,
                    "multiIndex[0]": e.detail.value,
                    "multiIndex[1]" : 0
                })

        }
    },
    saveMap:function(e){
        wx.showLoading({
            title: '保存中',
        })
        const map =  Bmob.Query('map');

        map.equalTo("openid","==",app.globalData.userInfo.openid);
        map.find().then(res => {
            console.log(res);
            if(res.length !=0){
                map.set('id', res[0].objectId);
                map.set('myData',myData);
            }else {
                map.set('openid',app.globalData.userInfo.openid);
                map.set('nickName',app.globalData.userInfo.nickName);
                map.set('avatarUrl',app.globalData.userInfo.avatarUrl);
                map.set('myData',myData);
            }

            map.save().then(res =>{
                wx.hideLoading()
                wx.navigateTo({
                    url: `../map/index?openid=${app.globalData.userInfo.openid}`,
                    success:function () {
                    }
                });
            })
        })
    }
})

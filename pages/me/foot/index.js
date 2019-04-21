import china from './china.js';

//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');


let that;

Page({
    data: {
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
                            {name: '安徽省'},
                            {name: '江苏省'},
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
                            {name: '中国澳门'}

                        ], [
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
                                        ]
                         ],
        objectMultiArray:china,
        selected:[]
    },
    onLoad: function () {
        that = this
        console.error(china);

    },
    onReady:function () {
        //监听页面初次渲染完成

    },
    onShow:function () {

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
    bindMultiPickerChange: function(e){
        let obj = that.data.selected[e.detail.value[1]];
        let setObj = {
            name:obj.name,
            value:[Number(obj.log),Number(obj.lat)]
        }
        console.log(setObj)
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
    }
})



import * as echarts from '../../../ec-canvas/echarts.js';
import geoJson from './china.js';
import china from './china2.js';

let that;
//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

let titletext = `在路上，追忆似水年华`;
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
let chart;
var myData = [
    // {name: '海门', value: [121.15, 31.89]}
    // {name: '鄂尔多斯', value: [109.78, 39.60]},
    // {name: '招远', value: [120.38, 37.35]},
    // {name: '舟山', value: [122.20, 29.98]}
]
// 初始化 地图
function initChart(canvas, width, height) {
     chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);
    echarts.registerMap('china', geoJson);

    const option = {
        tooltip: {},
        title:{
            show:true,
            text:'足迹遍布'+ myData.length + '城市',
            textStyle:{
                color:'#000',
                fontStyle:'normal',
                fontFamily:'monospace',
                align:'center'
            },
            subtext:titletext

        },
        backgroundColor:'rgba(0, 0, 0,0)',
        // dataZoom: [{ show: true, start: 0, end: 100 }],
        geo: {
            map: 'china',
            roam: true,
            zoom:1.5,
            // aspectScale:1,
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#000'
                    }
                },
                emphasis:{
                    show:false
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#FFFFCC',
                    areaColor: '#FFCCCC',
                    color: '#000',
                    textStyle: {
                        color: '#000'
                    }
                },
                emphasis: {
                    borderColor: '#FFFFCC',
                    areaColor: '#FFCCCC',
                    color: '#000',
                    textStyle: {
                        color: '#000'
                    },
                    borderWidth: 0
                }
            },
        },

        series: [
        {
            name: '足迹', // series名称
            type: 'scatter', // series图表类型
            coordinateSystem: 'geo', // series坐标系类型
            data: myData,
            symbolSize: 50,
            symbol:'pin',
            animation: true,
            hoverAnimation:true,
            cursor:'pointer',
            itemStyle:{
                color:'#FF0033'
            },
            label:{
                formatter: '{b}',
                show:true
            }
        }
        ],

    };

    chart.setOption(option);

    return chart;
}


Page({
    data: {
        ec: {
            onInit: initChart
        },
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
        options:{}
    },
    onLoad: function (options) {
        that = this;
        if(options.openid){
            that.data.options = options;
            return;
        }
        //如果没有传入openid则取自己的openid
        that.data.options.openid = app.globalData.userInfo.openid;
    },
    onReady:function () {
        //监听页面初次渲染完成

    },
   onShow:function () {
        //监听页面显示
        API.getMap(that.data.options).then(res =>{
            if(res.length != 0){
                myData = res[0].myData;
                changeTitletext();
                if(chart){
                    chart.setOption({series:[
                        {
                            name: '足迹', // series名称
                            type: 'scatter', // series图表类型
                            coordinateSystem: 'geo', // series坐标系类型
                            data: myData,
                            symbolSize: 50,
                            symbol:'pin',
                            animation: true,
                            hoverAnimation:true,
                            cursor:'pointer',
                            itemStyle:{
                                color:'#FF0033'
                            },
                            label:{
                                formatter: '{b}',
                                show:true
                            }
                        }
                    ],  title:{
                        show:true,
                        text:'足迹遍布'+ myData.length + '城市',
                        textStyle:{
                            color:'#000',
                            fontStyle:'normal',
                            fontFamily:'monospace',
                            align:'center'
                        },
                        subtext:titletext

                    },
                    })
                }
            }
        })
    },
    onHide:function () {
        saveMap(myData,function () {
            console.log('保存map成功')
        })

        console.error('map:hidden')
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
        myData.push(setObj);
        if(chart){
            chart.setOption({series:[
                {
                    name: '足迹', // series名称
                    type: 'scatter', // series图表类型
                    coordinateSystem: 'geo', // series坐标系类型
                    data: myData,
                    symbolSize: 50,
                    symbol:'pin',
                    animation: true,
                    hoverAnimation:true,
                    cursor:'pointer',
                    itemStyle:{
                        color:'#FF0033'
                    },
                    label:{
                        formatter: '{b}',
                        show:true
                    }
                }
            ]
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
    }

})


function saveMap(data,cal) {
    console.log(data);
    const map =  Bmob.Query('map');

    map.equalTo("openid","==",app.globalData.userInfo.openid);
    map.find().then(res => {
        console.log(res);
        if(res.length !=0){
            map.set('id', res[0].objectId);
            map.set('myData',data);
        }else {
            map.set('openid',app.globalData.userInfo.openid);
            map.set('nickName',app.globalData.userInfo.nickName);
            map.set('avatarUrl',app.globalData.userInfo.avatarUrl);
            map.set('myData',data);
        }

        map.save().then(res =>{
            cal(res);
        })
    })

}

function changeTitletext() {
    let len = myData.length;
    if(0<len&&len<10){
        titletext = `在路上，追忆似水年华`;
    }else if(10<=len&&len<20){
        titletext = `旅途中`;
    }else if(20<=len&&len<30){
        titletext = `路上还有很多美景，放弃利益性的社交，找回那个最初的自己`;
    }else{
        titletext = `一直在路上，待续`;
    }
}
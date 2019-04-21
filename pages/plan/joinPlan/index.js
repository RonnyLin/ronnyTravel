import { $wuxDialog } from '../../../component/index'


//获取应用实例
const
    app = getApp(),
    Bmob = require('../../../utils/Bmob-1.6.1.min.js'),
    Storage = require('../../../utils/storage.js'),
    API = require('../../../api/API.js'),
    utils = require('../../../utils/util.js');

let me ;
Page({
    data: {
        plan:{},
        shareId:'',
        joinuser:[],
        joinplan:[],
        hasbeenjoin:false
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        });
        me = this;
        me.data.shareId = options.shareId;
        if(options.shareId){
            let plan =  Bmob.Query('plan');
            plan.equalTo("objectId","==",options.shareId);
            plan.find().then(res =>{
                console.error(res)
                me.setData({
                    'plan':res[0]
                })
            })
        }

        // 计划参与的用户
        const plan = Bmob.Query('plan');
        plan.field('joinuser',me.data.shareId);
        plan.relation('wxuser').then(res => {
            console.log(res);
            me.data.joinuser = res;
            let idx = res.findIndex(e =>{
                return(e.objectId == app.globalData.userInfo.objectId)
            });
            if(idx>-1){
                me.data.hasbeenjoin = true;
            }
        })


        // 用户参与的计划
        const wxuser = Bmob.Query('wxuser');
        wxuser.field('joinplan',app.globalData.userInfo.objectId);
        wxuser.relation('plan').then(res =>{
            console.log(res);
            me.data.joinplan = res;
        })

    },
    onReady:function () {
        //监听页面初次渲染完成
        wx.hideLoading();
    },
    onShow:function () {
        //监听页面显示
    },
    onHide:function () {
        //监听页面隐藏
    },
    watchMap:function (e) {
        console.error(e);
        let latitude = e.currentTarget.dataset.site[0];
        let longitude = e.currentTarget.dataset.site[1];
        //
        if(latitude) {
            // wx.navigateTo({
            //     url: `../map_detail/index?latitude=${latitude}&longitude=${longitude}`,
            //     success:function () {
            //     }
            // });
            wx.openLocation({
                latitude: Number(latitude),
                longitude: Number(longitude),
                scale: 14
            })
        }
    },
    watchUser:function (e) {
        console.error(e.currentTarget.dataset.openid)
        let openid = e.currentTarget.dataset.openid;
        if(openid) {
            wx.navigateTo({
                url: `/pages/home/user/index?openid=${openid}`,
                success:function () {
                }
            });
        }
    },
    join:function (e) {
        //校验数据
        if(me.data.hasbeenjoin){
            fail('你已经在这个旅行里面了噢！');
            return;
        }

        if(me.data.joinplan.length>=2 && app.globalData.userInfo.vip ==0){
            fail('你已经加入了两个旅行计划了，想要加入更多的旅行，请联系客服噢！');
            return;
        }



        const alert = (content) => {
            $wuxDialog('#wux-dialog--alert').alert({
                resetOnClose: true,
                title: '提示',
                content: content,
            })
        }

        $wuxDialog().prompt({
            resetOnClose: true,
            title: '请输入你的联系方式',
            content: '让你的伙伴随时联系你',
            fieldtype: 'text',
            defaultText: '',
            site:false,
            placeholder: '让你的伙伴随时联系你',
            onConfirm(e, response) {
                if(response.value == 0){
                    alert('联系方式不能为空')
                    return;
                }
                let userData = {
                    name:app.globalData.userInfo.nickName,
                    openid:app.globalData.userInfo.openid,
                    avatarUrl:app.globalData.userInfo.avatarUrl,
                    objectId:app.globalData.userInfo.objectId,
                    phone:response.value
                };
                me.data.plan.join.push(userData)
                relation(me.data.plan.join);
            },
            onCancel(e){

            }
        })

            let count = 0;
            let result = {};



        function relation(join) {
            console.error(join)

            // // 用户要绑定计划表里
            const relation = Bmob.Relation('wxuser');
            const relID = relation.add(app.globalData.userInfo.objectId);
            const plan = Bmob.Query('plan');

            plan.get(me.data.shareId).then(res =>{
                res.set('joinuser',relID);
                res.set('join',join);
                res.save().then(wxuser =>{
                    console.error(wxuser);
                    done('wxuser',wxuser)
                }).catch(err => {
                    console.log(err)
                })
            });


            //计划要绑定用户表里
            const relation2 = Bmob.Relation('plan');
            const relID2 = relation2.add(me.data.shareId);
            const wxuser = Bmob.Query('wxuser');


            wxuser.get(app.globalData.userInfo.objectId).then(res =>{
                console.error(res);
                res.set('joinplan',relID2);
                res.save().then(plan =>{
                    console.error(plan);
                    done('plan',plan)
                }).catch(err => {
                    console.log(err)
                })
            });

        }

            function done(key,value) {
                result[key] = value;
                count++;
                if(count==2){
                    me.data.hasbeenjoin = true;
                    // console.error('保存成功')
                    wx.showToast({
                        title: '加入成功',
                        icon: 'none',
                        duration: 3000
                    });
                    me.returnMainPage()
                }
            };

            function fail(message) {
                result ={};
                count = 0;
                wx.showToast({
                    title: message,
                    icon: 'none',
                    duration: 3000
                });
            };

        },
    returnMainPage:function (e) {
        wx.switchTab({
            url: `/pages/list/index`,
            success:function () {
            }
        })
    }
})



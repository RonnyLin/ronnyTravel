//获取应用实例
const
    app = getApp(),
    Bmob = require('../../utils/Bmob-1.6.1.min.js');

let timeOut;
Component({
    externalClasses: [''],
    options: {
        multipleSlots: true,
    },
    properties: {
        replayComment:{
            type:Object,
            value:{}
        },
        like:{
          type:Boolean,
          value:false
        }
    },
    data: {
        focus:false,
        content:'',
        value:''
    },
    observers:{
        'replayComment':function (replayComment) {

        }
    },
    methods: {
        bindfocus(e){
            timeOut && clearTimeout(timeOut);
            this.setData({focus:true},function () {
                this.triggerEvent('myFocus');
            });
            console.error(e)
        },
        replayfocus(e){
            let me = this;
            timeOut && clearTimeout(timeOut);
            if(me.data.focus){
                me.unfocus(0);
                return
            }
            this.setData({focus:true},function () {
                this.triggerEvent('myFocus');
            });
        },

        bindblur(e){
            let me = this;
            clearTimeout(timeOut);
            timeOut = setTimeout(()=>{
                me.setData({
                    focus:false,
                    replayComment:{}
                },function () {
                });
            },1000);
            this.triggerEvent('myBlur');
        },
        unfocus(times = 1000){
            let me = this;
            timeOut = setTimeout(()=>{
                me.setData({
                    focus:false,
                    replayComment:{}
                },function () {
                });
            },times);
            this.triggerEvent('myBlur');
        },
        publish(e){
            let me = this;
            console.error('发布成功');
            clearTimeout(timeOut);
            if(!this.content)return;
            let replayOptions = {
                content : this.content,
                replayComment:this.properties.replayComment
            }
            this.triggerEvent('myPublish',replayOptions);
            this.setData({
                content:'',
                focus: false,
                value:'',
                replayComment:{}
            })
            this.triggerEvent('myBlur');
        },
        bindKeyInput(e){
            this.content = e.detail.value;
        },
        like(){
            this.setData({
                like:true
            })
            this.triggerEvent('myLike');
        },
        share(){
            this.triggerEvent('myShare');
        },
        erweima(){
            this.triggerEvent('myErweima');
        },
        onShareAppMessage: function (res) {
            if (res.from === 'button') {
                // 来自页面内转发按钮
                console.log(res.target)
            }
            return {
                title: `${app.globalData.userInfo.nickName}.邀你加入旅行:${me.data.plan.title}`,
                imageUrl:'http://bmob-cdn-20413.b0.upaiyun.com/2018/07/23/168e06a7402c02db80cbce3ad021ec6e.png',
                path: `/pages/loading/index?openid=${app.globalData.userInfo.openid}&shareflag=1&objectId=${me.data.objectId}`
            }
        },
    },
    lifetimes:{
        created() {
            console.error(this)
        },
        attached() {

        },
    }

})
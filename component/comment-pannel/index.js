//获取应用实例
const
    app = getApp(),
    Api = require('../../api/API.js'),
    Bmob = require('../../utils/Bmob-1.6.1.min.js');

Component({
    externalClasses: [''],
    options: {
        multipleSlots: true,
    },
    properties: {
        comments:{
            type:Array,
            value:{}
        },
        likes:{
            type:Array,
            value:{}
        }
    },
    data: {
        current: 'tab1'
    },
    observers:{

    },
    methods: {
        onChange(e) {
            console.log('onChange', e);
            console.log(e);
            this.setData({
                current: e.detail.key,
            })
        },
        reply(e){
            let me = this;
            let replyComment = e.currentTarget.dataset.comment;
            this.triggerEvent('replyComment', replyComment);
        },
        like(e){
            let me = this;
            let idx = this.data.comments.findIndex( (v,i) =>{
                return v.objectId == e.currentTarget.dataset.objectid;
            });
            let attr_unliked = `comments[${idx}].unliked`;
            let attr_like = `comments[${idx}].like`;
            let attr_like_num = this.data.comments[idx].like + 1;
            this.setData({
                 [attr_unliked] : true,
                 [attr_like]:attr_like_num
            },function () {
                Api.setAlbumCommentLikePlus({
                    type:'like',
                    objectId:e.currentTarget.dataset.objectid
                })
            })

            this.triggerEvent('refreshComments',me.data.comments);

            console.error(e);
        }
    },
    lifetimes:{
        created() {

        },
        attached() {

        },
    }

})
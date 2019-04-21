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
        poster:{
            type:Object,
            value:{}
        }
    },
    data: {

    },
    observers:{

    },
    methods: {
        enter_page(e){
            let me = this;
            let objectId = e.currentTarget.dataset.page.objectId,
                type = e.currentTarget.dataset.page.type,
                url = e.currentTarget.dataset.page.pageUrl;
            if(objectId) {

                let read = `poster.read`;
                let read_num = me.data.poster.read + 1;

                me.setData({
                    read:read_num
                })

                Api.setAlbumPlus({
                    type:'read',
                    objectId:objectId
                }).then(e =>{
                    console.error(e);
                })

                wx.navigateTo({
                    url: `${url}?objectId=${objectId}&type=${type}`,
                    success:function () {
                    }
                });
            }
        }
    },
    lifetimes:{
        created() {

        },
        attached() {

        },
    }

})
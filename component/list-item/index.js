
Component({
    externalClasses: [''],
    options: {
        multipleSlots: true,
    },
    properties: {
        list:{
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
            let objectId = e.currentTarget.dataset.page.objectId,
                type = e.currentTarget.dataset.page.type,
                url = e.currentTarget.dataset.page.pageUrl;
            if(objectId) {
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
(function (){
    let api = {
        getSystemInfo:function () {
            return  Q((resolve,reject) =>{
                wx.getSystemInfo({
                    success:function (res) {
                        resolve(res);
                    }
                })
            })
        },
        getImageInfo:function (opt) {
            return Q((resolve,reject) =>{
                wx.getImageInfo({
                    src: opt.src,
                    success: function (res) {
                        resolve(res);
                    },
                    fail:function (res) {
                        reject(res);
                    }
                })
            })
        },
        getLocation:function () {
            return Q((resolve,reject) =>{
                wx.getLocation({
                    type: 'wgs84',
                    success: function(res) {
                        resolve(res)
                    },
                    fail:function (res) {
                        reject(res);
                    }
                })
            })
        }

    };

    function Q(caller) {
        let promise = new Promise(function (resolve, reject) {
            caller(resolve, reject);
        });
        return promise;
    }

        module.exports = api;

}());
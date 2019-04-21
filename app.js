const
    Bmob = require('./utils/Bmob-1.6.1.min.js'),
    Storage = require('./utils/storage.js'),
    wxApi = require('./api/wxApi.js'),
    { appkey, appsecret } = require('./person-config.js')
  ;
Bmob.initialize("appkey", "appsecret");

//app.js
App({
  onLaunch: function (data) {
    console.log(data);
    let me = this;  
     Bmob.User.auth().then(res => {
          let options = me.globalData.userInfo = {
              openid:res.authData.weapp.openid,
              session_key:res.authData.weapp.session_key,
              sessionToken:res.sessionToken,
              username:res.username
          };
          Object.assign(me.globalData.userInfo,options);
          let userInfo = Storage.get(options.openid);
          //如果本地不存在该用户 插入数据库和本地
          if(!userInfo){
              Storage.set(options.openid,options);
          }
          me.getUserInfoByStorage(options,me,function (res) {
              console.error(res)
          });
      }).catch(err => {
        console.error('Bmob.user!');
        console.log(err);
    });

      wxApi.getSystemInfo().then(res =>{
          me.globalData.systemInfo = res;
          console.log(me.globalData.systemInfo);
      })
  }
  ,onShow:function () {
        
    }
  ,onHide:function () {
        
    }
  ,onError:function () {
        
    }
  ,onPageNotFound:function () {
        
    }  
  
  ,getUserInfoByStorage:getUserInfoByStorage
  ,getSystemInfo:getSystemInfo
  
  ,globalData:{
    userInfo:{},
    systemInfo:{}
  }

})

function getUserInfoByStorage(option,app,cal) {
    let wxuser =  Bmob.Query('wxuser');
        let options = option;

        wxuser.equalTo("openid","==",options.openid);
        wxuser.find().then(res =>{
          console.log(res);
          console.log('查找完毕');
              if(res && res.length != 0 && !options.encryptedData){
                  app.globalData.userInfo = res[0];
                  console.error('该用户已经打开过小程序');
                  app.globalData.firstOpenFlag = false;
                return;
              }
            if(res && res[0]&&res[0].avatarUrl){
               app.globalData.userInfo = res[0];
                console.error('数据库已经存在此数据，不再插入');
                return;
            }
            //首次打开
            app.globalData.firstOpenFlag = true;
            wxuser.set("openid",options.openid);
            wxuser.set("session_key",options.session_key);
            wxuser.set("sessionToken",options.sessionToken);
            wxuser.set("username",options.username);

            if(options.encryptedData){
                wxuser.set('id', res[0].objectId);
                wxuser.set("encryptedData",options.encryptedData);
                wxuser.set("iv",options.iv);
                wxuser.set("signature",options.signature);
                wxuser.set("avatarUrl",options.avatarUrl);
                wxuser.set("city",options.city);
                wxuser.set("country",options.country);
                wxuser.set("gender",options.gender);
                wxuser.set("nickName",options.nickName);
                wxuser.set("province",options.province);
                wxuser.set("vip",0);
            }
          wxuser.save().then(res => {
              console.log(res)
              console.log('插入成功');
              if(!app.globalData.userInfo.objectId){
                  wxuser.equalTo("openid","==",options.openid);
                  wxuser.find().then(user =>{
                      if(user[0]){
                          Object.assign(app.globalData.userInfo,user[0])
                          console.error(app.globalData.userInfo);
                      }
                      cal(res)
                  });
                  return
              }
              cal(res)
          }).catch(err => {
              console.log(err)
              cal(err)
          })
          })
}



//获取屏幕信息
function getSystemInfo(cb){
  wx.getSystemInfo({
      success: function(res) {
        cb(res.windowWidth, res.windowHeight)
      }
    })
}

//拓展对象
Object.extend = function () {
  var args = arguments;
  if (args.length < 2) return;
  var firstObj = args[0];
  console.log('first',firstObj);
  for(var i = 1; i < args.length; i++){
      for(var x in args[i]){
          firstObj[x] = args[i][x];
      }
  }
  console.log('first',firstObj);
  return firstObj;
}
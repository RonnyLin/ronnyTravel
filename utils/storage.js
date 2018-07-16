module.exports = {
	get :function (key) {
		try {
			  let value = JSON.parse(wx.getStorageSync('key') || '{}')
			  if (value) {
			     return value.data;
			  }
			} catch (e) {
	  			  console.error(e)
	  			  return
		 	}
	},
	set : function (key, data){
			let v = {
				data : data
			}
			try {
	  			wx.setStorageSync(key, v);
			} catch (e) {   
	  			  console.error(e)
	  			  return
			}
	}
}
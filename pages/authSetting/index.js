const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    setting: {
      type: "String",
      value: "",
      observer:function(news, olds, path){
        console.log('properties: ', news, olds, path)
      }
    }
  },
  data: {
  },
  attached() {
    console.log("auth-setting")
  },
  methods: {
    updateProps(e) {
      var myEventDetail = {
        setting: '',
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('authsettingevent', myEventDetail, myEventOption)
    },
    cancel() {
      var myEventDetail = {
        setting: '',
      }
      var myEventOption = {}
      this.triggerEvent('authsettingevent', myEventDetail, myEventOption)
    },
    onGotUserInfo (e) {
      app.globalData.userInfo = e.detail.userInfo
      wx.setStorage({
        key: 'userInfo',
        data: res.userInfo,
      })
      this.cancel()
    },
  }
})
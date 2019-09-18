//app.js
import { isEmpty } from './utils/util'
import { ColorList } from './data/colorData'

App({
  onLaunch: function (e) {
    // 展示本地存储能力
    this.updateLog()
    // 检查是否是iphone X
    this.isIpx()
    // 检查程序更新同步
    this.checkUpdate()
    // 检查数据打点
    this.trackSrc(e)
    // 获取用户信息
    this.getUserInfo()
    // 自定义设置导航条样式
    this.customSystemBarStyle()
  },

  updateLog: function() {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function() {
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  customSystemBarStyle: function() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },

  /**
   * 是否是Iphonex
   */
  isIpx: function() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        let pixelRation = res.windowWidth / res.windowHeight;
        that.globalData.isIpx = !!~res.model.toString().indexOf('iPhone X') || (pixelRation < 0.6)
      },
    })
  },
  
  trackSrc: function(e) {
    const {
      scene,
      query
    } = e
    if (isEmpty(query)) {
      switch (scene) {
        case 1021:
        case 1043:
        case 1058:
        case 1067:
        case 1074:
        case 1082:
        case 1091:
        case 1102:
          this.track('open_way', {
            enterWay: '公众号'
          })
          break;
        case 1011:
        case 1012:
        case 1013:
          this.track('open_way', {
            enterWay: '常规二维码'
          })
          break;
        case 1036:
        case 1044:
          this.track('open_way', {
            enterWay: '分享卡片'
          })
          break;
      }
    } else {
      this.track('open_way', {
        enterWay: '参数二维码'
      })
    }
  },

  /**
   * 事件追踪
   */
  track: function(eventName, properties) {
    console.log(eventName, properties)
    // sensors.track(eventName, properties);
  },

  onShow: function(options) {
    this.scene = options.scene;
  },

  checkUpdate: function() {
    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed((res) => {
      console.log("update.fail", res)
    })
  },

  globalData: {
    userInfo: null,
    ColorList, ColorList,
  }
})
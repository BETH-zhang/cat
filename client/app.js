//app.js
App({
  globalData: {
    userInfo: null,
    userDataPath: `${wx.env.USER_DATA_PATH}/`,
  },

  onLaunch (e) {
    this.autoUpdate()
    // 获取用户信息
    this.getUserInfo()
    // 自定义设置导航条样式
    this.globalData()
    // 初始化云服务
    this.initCloudServer()
  },

  initCloudServer() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return null
    }
    wx.cloud.init({
      env: 'dev-5x6mb',
      traceUser: true,
    })
  },

  getUserInfo() {
    // 登录
    wx.login({
      success: res => {
        // console.log(res)
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
              wx.setStorage({
                key: 'userInfo',
                data: res.userInfo,
              })

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

    wx.getSystemInfo({
      success: e => {
        this.globalData.systemInfo = e
      }
    })
  },

  globalData() {
    wx.getSystemInfo({
      success: e => {
        // console.log('getSystemInfo: ', e)
        this.globalData.systemInfo = e
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        custom = this.globalData.Custom = custom.bottom ? custom : {
          bottom: 56,
          top: 24,
        };
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.container = {
          width: e.windowWidth,
          height: e.platform === 'android' ? e.windowHeight : e.windowHeight - this.globalData.CustomBar
        }
      }
    })
  },

  onShow(options) {
    this.scene = options.scene;
  },

  autoUpdate() {
    console.log(new Date())
    var self=this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //2. 小程序有新版本，则静默下载新版本，做好更新准备
        updateManager.onUpdateReady(function () {
        console.log(new Date())
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success (res) {
          if (res.confirm) {
            //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          } else if (res.cancel) {
            //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
            wx.showModal({
            title: '温馨提示~',
            content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
            success (res) {   
              self.autoUpdate()
              return;         
              //第二次提示后，强制更新           
              if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
              } else if (res.cancel) {
              //重新回到版本更新提示
              self.autoUpdate()
              }
            }
            })
          }
          }
        })
        })
        updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        })
        })
      }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

})
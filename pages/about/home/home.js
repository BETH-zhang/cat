const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    logCount: (wx.getStorageSync('logs') || []).length,
    workCount: (wx.getStorageSync('myWork') || []).length,
  },
  attached() {
    console.log("about")
    this.setData(app.globalData.userInfo)
    
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();
    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(0),
          forksCount: that.coutNum(0),
          visitTotal: that.coutNum(0)
        })
      }
    }
    wx.hideLoading()
  },
  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    showQrcode() {
      wx.previewImage({
        urls: ['https://s2.ax1x.com/2019/09/18/n7cScF.jpg'],
        current: 'https://s2.ax1x.com/2019/09/18/n7cScF.jpg' // 当前显示图片的http链接      
      })
    },
    removeStorage() {
      // 清除本地所有的 
      try {
        wx.removeStorageSync('logs')
        wx.removeStorageSync('myWork')
        // wx.removeStorageSync('colors')
        wx.removeStorageSync('qrcode')
        wx.removeStorageSync('avatar')
        this.setData({
          logCount: (wx.getStorageSync('logs') || []).length,
          workCount: (wx.getStorageSync('myWork') || []).length,
        })
      } catch (e) {
        // Do something when catch error
      }
      wx.showToast({
        title: '清除成功',
        icon: 'none',
        duration: 2000
      })
    },
  }
})
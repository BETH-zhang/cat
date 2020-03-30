// pages/webview/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      url: options.url
    })
  },

  onShareAppMessage: function () {
    console.log(this.options.url)
    return {
      title: this.options.title || 'webview',
      path: '/pages/webview/index?url=' + this.options.url,
      imageUrl: ''
    }
  },
})
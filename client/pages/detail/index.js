import { getImagePath } from '../../api/image'

// pages/webview/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: getImagePath('/home/logo.png'),
    path: 'https://s2.ax1x.com/2019/11/21/MIeqCd.jpg',
    author: 'Beth',
    title: 'title',
    content: [{
      text: 'contentcontentcontentcontent',
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options: ', options)
    this.setData({
      id: options.id
    })

    this.loadContent(options.id)
  },

  loadContent(id) {
    console.log(id)
  },

  BackPage() {
    wx.navigateBack({
      delta: 1
    });
  },

  onShareAppMessage() {
    console.log(this.options.url)
    return {
      title: this.options.title || 'webview',
      path: '/pages/detail/index?url=' + this.options.url,
      imageUrl: ''
    }
  },
})
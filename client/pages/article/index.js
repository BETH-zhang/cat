import { getImagePath } from '../../api/image'
import { query } from '../../api/index'
import config from '../../config'

// pages/webview/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: getImagePath('/home/logo.png'),
    path: '',
    author: 'Beth',
    title: '',
    content: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options: ', options)
    this.setData({
      id: options.id
    })

    this.initData(options.id)
  },

  initData(id) {
    console.log(id)
    query({
      name: 'article',
      data: {
        _id: id,
      },
    }).then((res) => {
      console.log(res)
      const data = res[0] || {}
      const content = data.content.split('\n').map((item) => {
        console.log(item)
        if (item.indexOf('https:') > -1) {
          return {
            image: item
          }
        } else if (item.indexOf('.jpg') > -1 || item.indexOf('.png') > -1 || item.indexOf('.jpeg') > -1 || item.indexOf('.gif') > -1) {
          return {
            image: getImagePath(item)
          }
        } else {
          return {
            text: item
          }
        }
      })
      this.setData({
        title: data.title,
        author: data.data,
        content,
        path: data.path ? getImagePath(data.path) : config.defaultBg,
      })
    })
  },

  BackPage() {
    wx.navigateBack({
      delta: 1
    });
  },

  onShareAppMessage() {
    return {
      title: this.options.title || 'webview',
      path: '/pages/article/index?id=' + this.options.url,
      imageUrl: ''
    }
  },
})
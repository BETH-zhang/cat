import { getImagePath, getTempFileURL } from '../../api/image'
import { query } from '../../api/index'
import config from '../../config'

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
      const cloudImgs = []
      const cloudIndexs = []
      const content = data.content.split('\n').map((item, index) => {
        console.log(item)
        if (item.indexOf('https:') > -1) {
          return {
            image: item
          }
        } else if (item.indexOf('.jpg') > -1 || item.indexOf('.png') > -1 || item.indexOf('.jpeg') > -1 || item.indexOf('.gif') > -1) {
          cloudImgs.push(getImagePath(item))
          cloudIndexs.push(index)
          return {
            image: getImagePath(item)
          }
        } else {
          return {
            text: item
          }
        }
      })

      if (data.path) {
        cloudIndexs.push(100)
        cloudImgs.push(getImagePath(data.path))
      }
      let path = data.path ? getImagePath(data.path) : config.defaultBg
      this.setData({
        title: data.title,
        author: data.data,
        content,
        path,
      })
      if (cloudImgs.length) {
        getTempFileURL(cloudImgs).then((imageRes) => {
          imageRes.fileList.forEach((item, index) => {
            if (cloudIndexs[index] === 100) {
              path = item.tempFileURL
            } else {
              content[cloudIndexs[index]] = {
                image: item.tempFileURL
              }
            }
          })

          this.setData({ content, path })
        })
      }
    })
  },

  BackPage() {
    wx.navigateBack({
      delta: 1
    });
  },

  onShareAppMessage() {
    return {
      title: this.options.id || '无内容',
      path: '/pages/article/index?id=' + this.options.id,
      imageUrl: ''
    }
  },
})
import { downloadFile } from '../../api/index'
import { getImagePath } from '../../api/image'

const app = getApp();
Page({
  data: {
    logo: getImagePath('/home/logo.png'),
    data: [],
    loading: true
  },
  onLoad() {
    this.initData()
  },
  initData() {
    downloadFile('/json/11.json', 'json')
      .then((data) => {
        const urls = data.map((item) => item && item.path)
        this.setData({
          data,
          urls,
          loading: false,
        })
      })
  },
  viewImages() {
    wx.previewImage({
      urls: this.data.urls,
      current: e.currentTarget.dataset.url,
    })
  }, 
})
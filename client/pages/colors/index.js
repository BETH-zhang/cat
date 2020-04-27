import { query, del } from '../../api/index'
import { getImagePath } from '../../api/image'
import { jumpPage } from '../../utils/wxUtils'

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
    query({
      name: 'colorCard',
    }).then((res) => {
      const data = []
      const urls = []
      res.forEach((item, index) => {
        data.push({
          ...item,
          path: getImagePath(item.imgPath)
        })
        urls.push(getImagePath(item.imgPath))
      })
      this.setData({ data, loading: false, urls })
    })
  },
  viewImages(e) {
    wx.previewImage({
      urls: this.data.urls,
      current: e.currentTarget.dataset.url,
    })
  }, 
  colorCard(e) {
    const index = e.target.dataset.index
    const colors = this.data.data[index]
    console.log(index, colors)
  },
  edit(e) {
    console.log(e)
    const id = e.target.dataset.id
    jumpPage('page', 'colorCard/index?id=' + id)
  },
  del(e) {
    console.log(e)
    const id = e.target.dataset.id
    del({
      name: 'colorCard',
      id,
    }).then((res) => {
      this.initData() 
    })
  },
})
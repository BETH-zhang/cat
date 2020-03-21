import { downloadFile } from '../../api/index'
import { getImagePath } from '../../api/image'

const app = getApp();
Page({
  data: {
    logo: getImagePath('/home/logo.png'),
    wave: getImagePath('/home/wave.gif'),
    pay: getImagePath('/home/pay.jpg'),
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    logCount: 0,
    workCount: 0,
  },
  onLoad() {
    this.initData()
  },
  initData() {
    const userInfo1 = app.globalData.userInfo || {}
    const userInfo2 = wx.getStorageSync('userInfo') || {}

    this.setData({
      avatarUrl: userInfo1.avatarUrl || userInfo2.avatarUrl || this.data.logo,
      nickName: userInfo1.nickName || userInfo2.nickName || '未登录'
    })
    console.log(userInfo1, userInfo2)
  },
  coutNum(e) {
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + 'k'
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + 'W'
    }
    return e
  },
  copyLink(e) {
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
      urls: [this.data.pay],
      current: this.data.pay // 当前显示图片的http链接      
    })
  },
})
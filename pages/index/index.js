import { formatTime1 } from '../../utils/util'
const app = getApp();

Page({
  data: {
    PageCur: 'home',
    // PageCur: 'flag',
  },
  onLoad() {
    console.log('basics', this.data.PageCur)
    var logs = wx.getStorageSync('logs') || []
    var time = formatTime1(Date.now(), 'YMD')
    if (logs.indexOf(time) === -1) {
      this.setData({ modalName: logs.length ? 'image' : '' })
    }
  },
  hideModal() {
    this.setData({ modalName: '' })
  },
  myEventListener(e) {
    console.log('e.detail: ', e)
    this.setData(e.detail)
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur,
    })
  },
  onShareAppMessage(e) {
    console.log('e: ', e)
    return {
      title: '程小元像素画',
      imageUrl: e ? e.target.dataset.cur : '/images/share.png',
      path: '/pages/index/index',
      success: function(res) {
        console.log('转发成功', res)
      },
      fail: function(res) {
        console.log('转发失败', res)
      },
    }
  },
})

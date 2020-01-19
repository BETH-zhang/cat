const app = getApp();

Page({
  data: {
    PageCur: 'home',
    PageCur: 'flag',
  },
  onLoad() {
    console.log('basics', this.data.PageCur)
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
  onShareAppMessage() {
    return {
      title: '程小元像素画',
      imageUrl: '/images/share.png',
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

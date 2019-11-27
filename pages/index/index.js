const app = getApp();

Page({
  data: {
    PageCur: 'home',
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
})

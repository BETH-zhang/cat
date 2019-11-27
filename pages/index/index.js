const app = getApp();

Page({
  data: {
    PageCur: 'home',
  },
  onLoad() {
    console.log('basics', this.data.PageCur)
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur,
    })
  },
})

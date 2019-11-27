const app = getApp();

Page({
  data: {
    PageCur: 'home',
  },
  onLoad() {
    console.log('basics')
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur,
      openSetting: false,
      loading: false,
    })
  },
})

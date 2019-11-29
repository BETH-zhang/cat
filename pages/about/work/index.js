const app = getApp();
Page({
  data: {
    works: [],
  },
  onLoad: function () {
    this.initData()
  },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  initData() {
    var works = wx.getStorageSync('myWork') || []
    const urls = works.map((item) => item && item.path)
    this.setData({
      works,
      urls,
    })
  },
  viewImages(e) {
    wx.previewImage({
      urls: this.data.urls,
      current: e.currentTarget.dataset.cur,
    })
  }
});

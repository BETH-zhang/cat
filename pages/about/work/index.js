const app = getApp();
Page({
  data: {
    works: [],
  },
  onLoad: function () {
    var works = wx.getStorageSync('myWork') || []
    console.log('----', works)
    this.setData({
      works,
    })
  },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});

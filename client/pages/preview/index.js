import Pixel from '../../utils/pixelApplication'
import pixelCardTheme0 from '../../assets/data/pixelCardTheme0';

const app = getApp();
Page({
  data: {
    img: "",
    color: "#454A4E",
    text: "程小元像素",
    textModal: false,

    showGrid: false,
    title: '程小元像素画',
    description: '',
    template: {},
    imgInfo: {},
    shareImg: '',
  },

  onLoad (options) {
    this.initCanvas()
  },

  SettingEventListener(e) {
    console.log(e.detail, '..SettingEventListener...')
    switch(this.data.setting || e.detail.setting) {
      case 'login':
        if (!e.detail.close) {
          this.setData({
            setting: '',
          })
          this.createImage()
        }
        break
      default:
        break
    }
  },

  initCanvas() {
    const width = app.globalData.systemInfo.windowWidth
    const height = app.globalData.systemInfo.windowHeight - app.globalData.CustomBar
    this.setData({ width, height })
    const ctxView = wx.createCanvasContext('previewCanvas', this)
    this.previewCanvas = new Pixel(ctxView, { width, height: width, id: 'previewCanvas' }, this)
    this.previewCanvas.preview(wx.getStorageSync('pixelData') || [], this.bgColor, (data) => {
      this.imgInfo = data.imgInfo
      this.checkLogin()
    })
  },

  checkLogin() {
    if (!app.globalData.userInfo) {
      this.setData({
        setting: 'login'
      })
    } else {
      this.createImage() 
    }
  },

  createImage() {
    wx.showLoading({
      title: '图片生成中',
    })
    const date = new Date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = year + '.' + month + '.' + day;   // 绘图的时间

    const data = {
      avatar: app.globalData.userInfo.avatarUrl,
      qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
      name: app.globalData.userInfo.nickName,
      title: this.data.title,
      description: this.data.description,
      time,
      imgInfo: this.imgInfo,
      bgColor: wx.getStorageSync('bgColor') || 'white',
    }

    this.setData({
      template: new pixelCardTheme0().palette(data),
    })
  },

  onImgOK(e) {
    this.setData({
      shareImg: e.detail.path,
    })
    wx.hideLoading()
  },

  //分享
  onShareAppMessage: function (res) {
    return {
      title: that.data.title,
      path: "pages/pixel/index",
      imageUrl: this.data.shareImg,
    }
  },

  backUp() {
    wx.navigateBack({
      delta: 1
    });
  },
})
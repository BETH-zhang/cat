// import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'
import ConvertPixel from '../../utils/convertPixel'

const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
  },
  attached() {
    console.log("convert")
    this.initData()
  },
  lifetimes: {
    ready() {
      console.log('ready')
      this.initCanvas()
    },
    attached() {
      console.log('attached')
    },
  },
  methods: {
    initData() {
      this.wxUtils = new WxUtils(wx, app)
      console.log('this.wxUtils: ', this.wxUtils)
    },
    initCanvas() {
      this.ConvertPixel = new ConvertPixel('cvCanvas', this)

      wx.getSystemInfo({
        success: ({
          screenWidth
        }) => {
          this.screenWidth = screenWidth;
        }
      })

      this.wxUtils = new WxUtils(wx, app)

      const width = app.globalData.systemInfo.windowWidth
      const height = app.globalData.systemInfo.windowHeight
      this.setData({ width, height })
    },
    chooseImg: function() {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.setData({
            imgPath: res.tempFilePaths[0],
          })
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: (imgInfo) => {
              let {
                width,
                height,
                imgPath
              } = imgInfo;
              let scale = 0.8 * this.screenWidth / Math.max(width, height);
              let canvasWidth = Math.floor(scale * width);
              let canvasHeight = Math.floor(scale * height);
              this.setData({
                imgInfo,
                canvasScale: scale,
                canvasWidth,
                canvasHeight
              });
              this.ConvertPixel.render({
                width: canvasWidth,
                height: canvasHeight,
                imgPath: res.tempFilePaths[0],
              });
            }
          })
        }
      }, this)
    },
  }
})
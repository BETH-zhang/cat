import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'

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
    this.initCanvas()
  },
  methods: {
    initData() {
      this.wxUtils = new WxUtils(wx, app)
      console.log('this.wxUtils: ', this.wxUtils)
    },
    initCanvas() {
      this.systemInfo = null
      const width = 300
      const height = 300
      const ctx = wx.createCanvasContext('cvCanvas')
      this.setData({ width, height })

      this.appCanvas = new TestApplication(ctx, { width, height })
      wx.getImageInfo({
        src: 'https://wx2.sinaimg.cn/orj360/9f7ff7afgy1g9ac546ennj20qu0kk1kx.jpg',
        success: res => {
          console.log('res: ', res)
          this.appCanvas.smartExtractPixel(res, wx)
        }
      })
    },
  }
})
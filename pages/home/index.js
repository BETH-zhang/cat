const app = getApp();
import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    PageCur: {
      type: "String",
      value: "home",
      observer:function(news, olds, path){
        console.log('properties: ', news, olds, path)
      }
    }
  },
  data: {
    hideCanvas: false,
    toolType: 'brush', // back, clearn, brush, eraser, straw, generate
    // toolType: 'generate',
    allowDraw: false,

    setting: '',

    shareImg: '',

    showGrid: false,
    title: '程小元像素画',
    description: '画一副像素画，送给你',

    pixelColor: 'rgba(240,113, 43, 1)',
    bgColor:  'rgba(255, 255, 255, 1)',
    fontColor: 'rgba(50, 50, 50, 1)'
  },
  lifetimes: {
    created() {
      console.log("created")
    },
    attached() {
      console.log("attached")
    },
    ready() {
      this.initCanvas()
    },
    moved() {
      console.log('moved')
    },
    detached() {
      console.log('detached')
    },
  },
  methods: {
    SettingEventListener(e) {
      console.log(e.detail, '..SettingEventListener...')
      switch(this.data.setting) {
        case 'login':
          this.setData({ setting: '', hideCanvas: false, })
          this.savePicture()
          break
        case 'color':
          this.setData({
            ...e.detail,
            setting: '',
            hideCanvas: false,
          })
          this.appCanvas.reDraw()
          break
        default:
          if (this.data.toolType === 'generate') {
            this.setData({
              ...e.detail,
              toolType: '',
              hideCanvas: false,
            }, () => {
              this.savePicture()
            })
          }
          break
      }
    },

    ToolChange(e) {
      const key = e.currentTarget.dataset.cur
      // back, clean, brush, eraser, straw, generate
      switch(key) {
        case 'back':
          this.appCanvas.undo()
          this.setData({
            toolType: 'brush',
            hideCanvas: false,
          })
          break
        case 'clean':
          this.appCanvas.clean()
          this.setData({
            toolType: 'brush',
            hideCanvas: false,
          })
          break
        case 'brush':
          this.setData({
            toolType: 'brush',
            setting: 'color',
            hideCanvas: true,
          })
          break
        case 'eraser':
          this.setData({
            toolType: 'eraser',
            hideCanvas: false,
          })
          break
        case 'generate':
          this.setData({
            toolType: 'generate',
            hideCanvas: true,
          })
          break
      }
    },

    NavChange(e) {
      var myEventDetail = {
        PageCur: e.currentTarget.dataset.cur,
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },

    tempCanvas(callback) {
      this.wxUtils.canvasToTempFilePath('mainCanvas', this).then((res) => {
        this.setData({
          shareImg: res.tempFilePath,
          hideCanvas: true,
        }, callback)
      })
    },

    updateCanvas(x, y, color) {
      if (this.data.toolType === 'brush') {
        this.appCanvas.updateGrid(x, y, color)
      } else if (this.data.toolType === 'eraser') {
        this.appCanvas.eraser(x, y)
      }
    },

    dispatchTouchStart(e) {
      if (!this.data.allowDraw) {
        this.setData({
          allowDraw: true,
          x0: e.touches[0].x,
          y0: e.touches[0].y
        })
        this.updateCanvas(e.touches[0].x, e.touches[0].y, this.data.pixelColor)
      }
    },

    dispatchTouchMove(e) {
      if (this.data.allowDraw) {
        this.setData({
          x: e.touches[0].x,
          y: e.touches[0].y
        })
        this.updateCanvas(e.touches[0].x, e.touches[0].y, this.data.pixelColor)
      }
    },

    dispatchTouchEnd(e) {
      if (this.data.allowDraw) {
        this.setData({
          allowDraw: false,
        })
        this.updateCanvas(this.data.x, this.data.y, this.data.pixelColor)
      }
    },

    initCanvas() {
      console.log('globalData', app.globalData)
      const width = app.globalData.systemInfo.windowWidth
      const height = app.globalData.systemInfo.windowHeight - app.globalData.Custom.bottom
      console.log(width, height)
      this.setData({ width, height })
      const ctx = wx.createCanvasContext('mainCanvas', this) 
      const ctxBg = wx.createCanvasContext('bgCanvas', this)

      this.bgCanvas = new TestApplication(ctxBg, { width, height, id: 'bgCanvas' }, wx)
      this.bgCanvas.init(this.data.bgColor)

      this.appCanvas = new TestApplication(ctx, { width, height, id: 'mainCanvas' }, wx)
      this.appCanvas.setColor(this.data.pixelColor)

      this.wxUtils = new WxUtils(wx, app, { width, height })   
    },
    
    savePicture() {
      console.log('app.globalData: ', app.globalData)
      if (!app.globalData.userInfo) {
        this.setData({
          setting: 'login',
          shareImg: '',
          hideCanvas: true,
        })
      } else {
        this.optPictureData()
      }
    },
  
    hideModal() {
      this.appCanvas.reDraw()
      this.setData({
        shareImg: '',
        showModal: false,
        hideCanvas: false,
        toolType: 'brush'
      })
    },
    
    optPictureData() {
      wx.showLoading({
        title: '图片生成中',
      })
      console.log('读取图片', this.data.shareImg)    
      const date = new Date;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const time = year + '.' + month + '.' + day;   // 绘图的时间

      const data = {
        avatar: app.globalData.userInfo.avatarUrl,
        qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
        logo: '',
        name: app.globalData.userInfo.nickName,
        title: this.data.title,
        description: this.data.description,
        time: time,
      }

      this.wxUtils.downLoadImg(data.avatar, 'avatar').then((res) => {
        data.avatar = res.path
        this.wxUtils.downLoadImg(data.qrcode, 'qrcode').then((res) => {
          data.qrcode = res.path
          console.log('data: ', data)

          this.appCanvas.createSharePicture(data, {
            color: this.data.bgColor,
            fontColor: this.data.fontColor,
            showGrid: this.data.showGrid
          })
          // canvas画图需要时间而且还是异步的，所以加了个定时器
          setTimeout(() => {
            // 将生成的canvas图片，转为真实图片
            console.log('生成图片')
            this.tempCanvas(() => {
              console.log('生成分享图')
              this.setData({ showModal: true })
              wx.hideLoading()
            })
          }, 500)
        })
      })
    },
  
    // 长按保存事件
    saveImg() {
      this.wxUtils.saveImage(this.data.shareImg, this).then(() => {
        this.hideModal()
      })
    },
  }
})

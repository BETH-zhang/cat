import { Pixel, Draw } from '../../utils/pixelApplication'
import {
  createSelectorQuery,
  saveImage,
  canvasToTempFilePath,
} from '../../utils/wxUtils'
import GestureRecognition from '../../utils/gestureRecognition'
import pixelCardTheme0 from '../../assets/data/pixelCardTheme0';

const app = getApp();

let timer = null
let gesture = {}
Page({
  data: {
    hideCanvas: false,
    toolType: 'brush', // undo, clearn, brush, eraser, straw, generate
    // toolType: 'generate',
    brushPanel: false,
    allowDraw: false,

    setting: '',

    shareImg: 'http://tmp/wx44378f03ea3692aa.o6zAJszQ4YQ5dZy0aDA8SHOSKW48.DqrxCQWImWHwf6dcc788fb7f9e0a7a16233ed16fac5e.png',
   
    showGrid: false,
    title: '程小元像素画',
    description: '',

    pixelColor: 'rgba(240,113, 43, 1)',
    bgColor:  'rgba(255, 255, 255, 1)',
    fontColor: 'rgba(50, 50, 50, 1)',
    arr: [],
    template: {},
    imgInfo: {},

    previewImage: null,
  },
  onLoad() {
    this.initCanvas()
  },
  initData() {
  },
  // imgload: function(e) {
  //   this.setData({
  //     'baseWidth': e.detail.width, //获取图片真实宽度
  //     'baseHeight': e.detail.height, //获取图片真实高度
  //     'scaleWidth': '100%', //给图片设置宽度
  //     'scaleHeight': '100%' //给图片设置高度
  //   })
  // },

  SettingEventListener(e) {
    console.log(e.detail, '..SettingEventListener...')
    switch(this.data.setting || e.detail.setting) {
      case 'login':
        this.setData({
          setting: '',
          hideCanvas: false,
        })
        if (!e.detail.close) {
          this.savePicture()
        } else {
          this.setData({
            showModal: false, 
          })
        }
        break
      case 'color':
        if (this.data.bgColor !== e.detail.bgColor) {
          this.bgCanvas.update({ bgColor: e.detail.bgColor })
          this.bgCanvas.initGrid()
          this.updatePreview(e.detail.bgColor)
        }
        this.setData({
          ...e.detail,
          setting: '',
          hideCanvas: false,
          toolType: 'brush',
        })
        this.appCanvas.update({ color: e.detail.pixelColor })
        break
      default:
        break
    }
  },

  ToolChange(e) {
    const key = e.currentTarget.dataset.cur
    // undo, clean, brush, eraser, straw, generate
    switch(key) {
      case 'undo':
        // this.appCanvas.undo()
        this.move(100, 100)
        break
      case 'clean':
        this.appCanvas.clean()
        break
      case 'brush':
        this.setData({
          toolType: 'brush'
        })
        this.appCanvas.update({ toolType: 'brush' })
        break
      case 'eraser':
        this.setData({
          toolType: 'eraser'
        })
        this.appCanvas.update({ toolType: 'eraser' })
        break
      case 'straw':
        this.setData({
          toolType: this.data.toolType === 'straw' ? 'brush' : 'straw',
        })
        break
      case 'generate':
        const history = this.appCanvas.canvasHistory.length
        if (history) {
          this.setData({
            toolType: 'generate',
          })
  
          wx.showLoading({
            title: '图片生成中',
          })
          this.tempCanvas(() => {
            this.savePicture()
          })
        } else {
          wx.showToast({
            title: '画点东西再预览',
            icon: 'none',
            duration: 1000
          }) 
        }
        break
    }
  },

  NavChange(e) {
    var myEventDetail = {
      PageCur: e.currentTarget.dataset.cur,
    } // detail对象，提供给事件监听函数
    var myEventOption = {} // 触发事件的选项
    this.triggerEvent('pixelevent', myEventDetail, myEventOption)
  },

  tempCanvas(callback) {
    canvasToTempFilePath('mainCanvas', {
      x: 0,
      y: 0,
      width: this.appCanvas.canvas.width,
      height: this.appCanvas.canvas.height,
    }, this).then((res) => {
      this.setData({
        shareImg: res.tempFilePath,
        imgInfo: {
          ...res,
          width: this.appCanvas.canvas.width,
          height: this.appCanvas.canvas.height,
        },
      }, callback)
    })
  },

  dispatchTouchStart(e) {
    this.createTimer()

    if (this.data.toolType !== 'straw') {
      gesture = this.gestureRecognition.touchStartEvent(e)
      console.log('gesture: ', gesture)
      switch (gesture.type) {
        case 'Single':
          this.appCanvas.touchStart(e)
          break;
        case 'Double':
          wx.showToast({
            title: '缩放画布',
            icon: 'none',
            duration: 2000
          })
          break;
      }
    } else {
      this.appCanvas.straw(e, (color) => {
        this.setData({ pixelColor: color })
      })
    }
  },

  dispatchTouchMove(e) {
    this.createTimer()
    if (this.data.toolType !== 'straw') {
      const gesture = this.gestureRecognition.touchMoveEvent(e)
      console.log('gesture: ', gesture)
      switch (gesture.type) {
        case 'Single':
          this.appCanvas.touchMove(e)
          break;
        case 'Double':
          if (gesture.scale) {
            this.setData({ scale: gesture.scale })
          }
          wx.showToast({
            title: JSON.stringify(gesture),
            icon: 'none',
            duration: 2000
          })
          break;
      }
    }
  },

  dispatchTouchEnd(e) {
    this.cancelTimer()
    if (this.data.toolType !== 'straw') {
      gesture = this.gestureRecognition.touchEndEvent(e)
      switch (gesture.type) {
        case 'Single':
          this.appCanvas.touchEnd()
          this.updatePreview()
          break;
        case 'Double':
          break;
      }
      gesture = {}
    } else {
      this.setData({ toolType: 'brush' })
    }
  },

  updatePreview(bgColor) {
    canvasToTempFilePath('mainCanvas', {
      x: 0,
      y: 0,
      width: this.appCanvas.canvas.width,
      height: this.appCanvas.canvas.height,
    }, this).then((res) => {
      const previewImage = res.tempFilePath
      const previewWidth = this.appCanvas.canvas.width / 4
      const previewHeight = this.appCanvas.canvas.height / 4
      this.setData({
        previewImage,
        previewWidth,
        previewHeight,
      })

      this.viewCanvas.fillRect(0, 0, previewWidth, previewHeight, bgColor || this.data.bgColor)
      this.viewCanvas.drawImage(
        previewImage,
        {x: 0, y: 0, width: previewWidth, height: previewHeight},
        {x: 0, y: 0, width: this.appCanvas.canvas.width, height: this.appCanvas.canvas.height},
      )
      this.viewCanvas.ctx.draw(false)
    })
  },

  createTimer() {
    this.cancelTimer()
    timer = setTimeout(() => {
      switch (gesture.type) {
        case 'Single':
          this.appCanvas.touchEnd()
          this.updatePreview()
          break;
        case 'Double':
          break;
      }
      gesture = {}
    }, 2000)
  },

  cancelTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  },

  initCanvas() {
    console.log('globalData', app.globalData)
    this.setData({ containerHeight: app.globalData.systemInfo.windowHeight - app.globalData.CustomBar })
    this.gestureRecognition = new GestureRecognition()
    createSelectorQuery('.main-bottom-bar', this).then((rect) => {
      const bottomBarStyle = rect.height
      const width = app.globalData.systemInfo.windowWidth
      const height = app.globalData.systemInfo.windowHeight - bottomBarStyle * 2.5 - app.globalData.CustomBar
      this.setData({ width, height })
      const ctx = wx.createCanvasContext('mainCanvas', this) 
      const ctxBg = wx.createCanvasContext('bgCanvas', this)
      const ctxView = wx.createCanvasContext('previewCanvas', this)

      this.bgCanvas = new Pixel(ctxBg, { width, height, id: 'bgCanvas' }, this)
      this.bgCanvas.update({ bgColor: this.data.bgColor })
      this.bgCanvas.initGrid()

      this.appCanvas = new Pixel(ctx, { width, height, id: 'mainCanvas' }, this)
      this.appCanvas.update({ color: this.data.pixelColor })

      this.viewCanvas = new Draw(ctxView, { width: width / 3, height: height / 3, id: 'previewCanvas' }, this)
    })
  },
  
  savePicture() {
    console.log('app.globalData: ', app.globalData)
    if (!app.globalData.userInfo) {
      wx.hideLoading()
      this.setData({
        setting: 'login',
        shareImg: '',
        hideCanvas: true,
      })
    } else {
      this.optPictureData()
    }
  },

  optPictureData() {
    console.log('读取图片', this.data.shareImg)    
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
      time: time,
      imgInfo: this.data.imgInfo,
      bgColor: this.data.bgColor,
    }

    this.setData({
      template: new pixelCardTheme0().palette(data),
    })
  },

  onImgOK(e) {
    console.log('生成分享图')
    this.setData({
      showModal: true,
      shareImg: e.detail.path,
      hideCanvas: true,
    })
    wx.hideLoading()
  },

  // 长按保存事件
  saveImg() {
    saveImage(this.data.shareImg, this)
  },

  backUp() {
    if (this.data.toolType === 'generate') {
      this.setData({
        toolType: 'brush',
      })
      this.initCanvas()
    } else {
      wx.navigateBack({
        delta: 1
      });
    }
  },

  // 画布移动
  canvasTranslate(x, y) {
    
  },
})
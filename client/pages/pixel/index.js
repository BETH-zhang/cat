import Pixel from '../../utils/pixelApplication'
import {
  createSelectorQuery,
} from '../../utils/wxUtils'

const app = getApp();

let timer = null
Page({
  data: {
    toolType: 'brush', // undo, clearn, brush, eraser, straw, generate
    // toolType: 'generate',

    setting: '',

    shareImg: 'http://tmp/wx44378f03ea3692aa.o6zAJszQ4YQ5dZy0aDA8SHOSKW48.DqrxCQWImWHwf6dcc788fb7f9e0a7a16233ed16fac5e.png',
   
    showGrid: false,
    title: '程小元像素画',
    description: '',

    pixelColor: wx.getStorageSync('color') || 'rgba(240,113, 43, 1)',
    bgColor:  wx.getStorageSync('bgColor') || 'rgba(255, 255, 255, 1)',
    fontColor: 'rgba(50, 50, 50, 1)',
    arr: [],
    template: {},
    imgInfo: {},

    previewImage: null,
    previewWidth: 100,
    previewHeight: 100,
  },

  onLoad() {
    this.initCanvas()
  },

  SettingEventListener(e) {
    console.log(e.detail, '..SettingEventListener...')
    switch(this.data.setting || e.detail.setting) {
      case 'color':
        if (this.data.bgColor !== e.detail.bgColor) {
          this.appCanvas.update({ bgColor: e.detail.bgColor })
          this.appCanvas.initGrid()
          this.updatePreview(this.appCanvas.data, e.detail.bgColor)
          wx.setStorage({
            key: 'bgColor',
            data: e.detail.bgColor,
          })
        }
        this.appCanvas.update({ color: e.detail.pixelColor })
        wx.setStorage({
          key: 'color',
          data: e.detail.pixelColor,
        })
        this.setData({
          ...e.detail,
          setting: '',
        })
        break
      default:
        break
    }
  },

  ToolChange(e) {
    const key = e.currentTarget.dataset.cur
    // undo, clean, brush, eraser, straw, generate
    switch(key) {
      case 'reset':
        this.appCanvas.reset()
        break
      case 'clean':
        this.appCanvas.clean(() => {
          this.updatePreview()
        })
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
        const data = this.appCanvas.data
        if (data.length) {
          wx.navigateTo({
            url: '../preview/index'
          });
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

  dispatchTouchStart(e) {
    this.isMove = false
    this.isDraw = false
    if (this.data.toolType !== 'straw') {
      this.touchLen = e.touches.length
      if (e.touches.length === 1) {
        this.isDraw = true
        this.createTimer()
        this.appCanvas.touchStart(e)
      } else if (e.touches.length > 1) {
        this.isMove = true
        this.appCanvas.touchMoveStart(e)
      }
    } else {
      this.appCanvas.straw(e, (color) => {
        this.setData({ pixelColor: color, toolType: 'brush' })
        this.appCanvas.update({ toolType: 'brush' })
      })
    }
  },

  dispatchTouchMove(e) {
    if (this.data.toolType !== 'straw') {
      this.touchLen = e.touches.length
      if (e.touches.length === 1 && this.isDraw) {
        this.createTimer()
        this.appCanvas.touchMove(e)
      } else if (e.touches.length > 1 && this.isMove) {
        this.appCanvas.touchMoveMove(e)
      }
    }
  },

  dispatchTouchEnd(e) {
    this.cancelTimer()
    if (this.data.toolType !== 'straw') {
      if (this.isDraw) {
        this.appCanvas.touchEnd((data) => {
          this.updatePreview(data)
        })
      }
      if (this.isMove) {
        this.appCanvas.touchMoveEnd(e)
      }
    } else {
      this.setData({ toolType: 'brush' })
    }
  },

  updatePreview(data, bgColor) {
    if (data && data.length) {
      this.setData({
        previewImage: true,
      })
      this.viewCanvas.preview(data, bgColor || this.data.bgColor)
    } else {
      this.setData({
        previewImage: false,
      }) 
    }
  },

  createTimer() {
    this.cancelTimer()
    timer = setTimeout(() => {
      if (this.isDraw) {
        this.appCanvas.touchEnd((data) => {
          this.updatePreview(data)
        })
      }
      this.touchLen = 0
    }, 2000)
  },

  cancelTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  },

  initCanvas() {
    this.setData({ containerHeight: app.globalData.systemInfo.windowHeight - app.globalData.CustomBar })
    createSelectorQuery('.main-bottom-bar', this).then((rect) => {
      const bottomBarStyle = rect.height
      const width = app.globalData.systemInfo.windowWidth
      const height = app.globalData.systemInfo.windowHeight - bottomBarStyle * 2.5 - app.globalData.CustomBar
      this.setData({ width, height })
      const ctx = wx.createCanvasContext('mainCanvas', this)
      const ctxView = wx.createCanvasContext('previewCanvas', this)

      this.appCanvas = new Pixel(ctx, { width, height, id: 'mainCanvas' }, this)
      this.appCanvas.update({
        bgColor: this.data.bgColor,
        color: this.data.pixelColor,
      })
      this.appCanvas.initGrid()

      this.viewCanvas = new Pixel(ctxView, { width: 100, height: 100, id: 'previewCanvas' }, this)
      this.updatePreview(this.appCanvas.data)
    })
  },
  
  backUp() {
    wx.navigateBack({
      delta: 1
    });
  },
})
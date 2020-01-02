const app = getApp();
import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'
import GestureRecognition from '../../utils/gestureRecognition'
import {
  requestAnimationFrame,
  cancelAnimationFrame
} from '../../utils/util'

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
    toolType: 'brush', // undo, clearn, brush, eraser, straw, generate
    brushPanel: false,
    // toolType: 'generate',
    allowDraw: false,

    setting: '',

    shareImg: '',

    showGrid: false,
    title: '程小元像素画',
    description: '',

    pixelColor: 'rgba(240,113, 43, 1)',
    bgColor:  'rgba(255, 255, 255, 1)',
    fontColor: 'rgba(50, 50, 50, 1)',
    arr: [],
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
          this.setData({
            setting: '',
            hideCanvas: false,
          })
          this.savePicture()
          break
        case 'color':
          if (this.data.bgColor !== e.detail.bgColor) {
            this.bgCanvas.init(e.detail.bgColor)
          }
          this.setData({
            ...e.detail,
            setting: '',
            hideCanvas: false,
            toolType: 'brush',
          })
          this.appCanvas.setColor(e.detail.pixelColor)
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
      // console.log('???', this.data)
      // undo, clean, brush, eraser, straw, generate
      switch(key) {
        case 'undo':
          const undo = this.appCanvas.undo()
          if (!undo) {
            wx.showToast({
              title: '没有历史记录了',
              icon: 'none',
              duration: 2000
            })
          }
          break
        case 'clean':
          this.appCanvas.snapshot()
          this.appCanvas.clean()
          break
        case 'brush':
          if (this.data.toolType === 'generate') {
            this.appCanvas.reDraw()
          }          
          this.setData({
            toolType: 'brush',
            hideCanvas: false,
            setting: '',
            brushPanel: false,
          })
          break
        case 'eraser':
          this.setData({
            toolType: 'eraser',
            hideCanvas: false,
            setting: '',
            brushPanel: false,
          })
          break
        case 'swatches':
          this.setData({
            toolType: this.data.toolType === 'swatches' ? 'brush' : 'swatches',
            setting: this.data.setting ? '' : 'color',
            hideCanvas: !this.data.setting
          })
          break
        case 'generate':
          this.appCanvas.ctx.clearRect(0, 0, this.data.width, this.data.height)
          this.appCanvas.fillRect(0, 0, this.data.width, this.data.height, this.data.bgColor)
          this.appCanvas.draw()
          this.tempCanvas()
          this.setData({
            toolType: 'generate',
            hideCanvas: true,
            setting: '',
          })
          break
      }
    },

    NavChange(e) {
      var myEventDetail = {
        PageCur: e.currentTarget.dataset.cur,
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('homeevent', myEventDetail, myEventOption)
    },

    tempCanvas(callback) {
      this.wxUtils.canvasToTempFilePath('mainCanvas', this).then((res) => {
        this.setData({
          shareImg: res.tempFilePath,
          hideCanvas: true,
        }, callback)
      })
    },

    updateCanvas(x0, y0, x, y, color) {
      if (this.appCanvas) {
        if (this.data.toolType === 'brush') {
          this.appCanvas.updateGrid(x0, y0, x, y, color)
        } else if (this.data.toolType === 'eraser') {
          this.appCanvas.eraser(x0, y0, x, y)
        }
      }
    },

    dispatchTouchStart(e) {
      if (!this.data.allowDraw) {
        this.data.allowDraw = true

        const gesture = this.gestureRecognition.touchStartEvent(e)
        // console.log('start', gesture)
        // console.log('gesture-start: ', gesture.type)
        switch (gesture.type) {
          case 'Single':
            this.data.arr = []
            this.appCanvas.snapshot()
            this.data.arr.push([e.touches[0].x, e.touches[0].y])
            break;
          case 'Double':
            // wx.showToast({
            //   title: '缩放画布',
            //   icon: 'none',
            //   duration: 2000
            // })
            break;
        }
      }
    },

    dispatchTouchMove(e) {
      if (this.data.allowDraw) {
        this.gestureRecognition.touchMoveEvent(e, (gesture) => {
          // console.log('gesture: ', gesture)
          // console.log('gesture-move: ', gesture.type)
          switch (gesture.type) {
            case 'Single':
              this.data.arr.push([e.touches[0].x, e.touches[0].y])
              this.render()
              break;
            case 'Double':
              // if (gesture.scale) {
              //   console.log('move')
              //   this.bgCanvas.initGridInterval(gesture.scale * 25, 0, 0)
              //   this.bgCanvas.init(this.data.bgColor)
              //   this.appCanvas.initGridInterval(gesture.scale * 25, 0, 0)
              //   this.appCanvas.reDraw()
              // }
              break;
          }
        })
      }
    },

    dispatchTouchEnd(e) {
      if (this.data.allowDraw) {
        this.data.allowDraw = false

        const gesture = this.gestureRecognition.touchEndEvent(e)
        // console.log('gesture-end: ', gesture.type)
        switch (gesture.type) {
          case 'Single':
            // this.render()
            break;
          case 'Double':
            // console.log(gesture)
            break;
        }
      }
    },

    animate(lastTime) {
      this.animateId = requestAnimationFrame((t) => {
        this.render()
        if (this.animateId) {
          this.animate(t)
        }
      }, lastTime)
    },

    stop() {
      cancelAnimationFrame(this.animateId)
      this.animateId = null
    },

    render() {
      // console.log('--', this.data.arr.length)
      if (this.data.arr.length >= 2) {
        this.updateCanvas(
          this.data.arr[0][0],
          this.data.arr[0][1],
          this.data.arr[1][0],
          this.data.arr[1][1],
          this.data.pixelColor,
        )
        this.data.arr.splice(0, 1)
      } else if (this.data.arr.length === 1) {
        this.updateCanvas(
          this.data.arr[0][0],
          this.data.arr[0][1],
          this.data.arr[0][0],
          this.data.arr[0][1],
          this.data.pixelColor,
        )
        this.data.arr.splice(0, 1)
      } else if (!this.data.allowDraw) {
        console.log('本次画完')
        this.stop()
      }
    },

    initCanvas() {
      console.log('globalData', app.globalData)
      this.wxUtils = new WxUtils(wx, app)
      this.gestureRecognition = new GestureRecognition()
      this.wxUtils.createSelectorQuery('.main-bottom-bar', this).then((rect) => {
        const bottomBarStyle = rect.height
        const width = app.globalData.systemInfo.windowWidth
        const height = app.globalData.systemInfo.windowHeight - bottomBarStyle
        this.setData({ width, height })
        const ctx = wx.createCanvasContext('mainCanvas', this) 
        const ctxBg = wx.createCanvasContext('bgCanvas', this)
  
        this.bgCanvas = new TestApplication(ctxBg, { width, height, id: 'bgCanvas' }, wx)
        this.bgCanvas.init(this.data.bgColor)
  
        this.appCanvas = new TestApplication(ctx, { width, height, id: 'mainCanvas' }, wx)
        this.appCanvas.setColor(this.data.pixelColor)

        this.wxUtils.setStyle({ width, height })
      })
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
      this.setData({
        shareImg: '',
        showModal: false,
        hideCanvas: false,
        toolType: 'brush',
      })
      this.appCanvas.reDraw()
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

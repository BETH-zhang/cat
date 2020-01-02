import ColorThief from '../../utils/color-thief.js'
import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'
import {
  rgbToHex,
  saveBlendent
} from '../../utils/util.js'
const app = getApp()
const STATE_EMPTY = 0;
const STATE_LOADING = 1;
const STATE_SUCCEED = 2;

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    imgPath: null,
    colors: [],
    colorList: [],
    imgInfo: {},
    colorCount: 7,
    state: STATE_EMPTY,
    currentColor: '',

    hideCanvas: true,
    setting: '',
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
          this.download()
          break
        default:
          break
      }
    },
    initCanvas: function() {
      this.colorThief = new ColorThief('imageHandler', this);
      var colorList = wx.getStorageSync('colors') || []
      this.setData({ colorList })

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
      
      const ctx = wx.createCanvasContext('mainCanvas', this) 
      this.appCanvas = new TestApplication(ctx, { width, height, id: 'mainCanvas' }, wx)
      this.wxUtils.createSelectorQuery('.main-bottom-bar', this).then((rect) => {
        console.log(rect, '---rect---')
      })
    },
    chooseImg: function() {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.setData({
            imgPath: res.tempFilePaths[0],
            state: STATE_LOADING
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
              let quality = 1;
              console.log(quality);
              this.colorThief.getPalette({
                width: canvasWidth,
                height: canvasHeight,
                imgPath: res.tempFilePaths[0],
                colorCount: this.data.colorCount,
                quality
              }, (colors) => {
                console.log('colors', colors);
                if (colors) {
                  colors = colors.map((color) => {
                    return ('#' + rgbToHex(color[0], color[1], color[2]))
                  })
                  this.setData({
                    colors,
                    state: STATE_SUCCEED
                  })
                }
              });
            }
          })
        }
      }, this)
    },
    save: function() {
      saveBlendent({colors:this.data.colors});
      var colorList = wx.getStorageSync('colors') || []
      this.setData({ colorList })
    },
    delete: function(e) {
      var colorList = wx.getStorageSync('colors') || []
      console.log(e.currentTarget.dataset.cur, colorList)
      var data = []
      colorList.forEach((item, index) => {
        if (index !== e.currentTarget.dataset.cur) {
          data.push(item)
        }
      })
      this.setData({ colorList: data })
      wx.setStorage({
        key: 'colors',
        data: data,
        complete: () => {
          console.log('save complete')
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      })
    },
    edit: function(e) {
      console.log('e: ', e)
    },
    download: function() {
      console.log(this.data) 
      console.log('app.globalData: ', app.globalData)
      if (!app.globalData.userInfo) {
        this.setData({
          setting: 'login',
          shareImg: '',
          hideCanvas: true,
        })
      } else {
        this.setData({
          hideCanvas: false,
        }, () => {
          this.optPictureData()
        })
      }
    },

    optPictureData() {
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
        logo: '',
        name: app.globalData.userInfo.nickName,
        title: '色卡分享',
        description: this.data.description,
        time: time,
        imgInfo: this.data.imgInfo,
        colors: this.data.colors
      }

      this.wxUtils.downLoadImg(data.avatar, 'avatar').then((res) => {
        data.avatar = res.path
        this.wxUtils.downLoadImg(data.qrcode, 'qrcode').then((res) => {
          data.qrcode = res.path
          console.log('data: ', data, this.appCanvas)

          this.appCanvas.createShareColorCard(data, {
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

    tempCanvas(callback) {
      this.wxUtils.canvasToTempFilePath('mainCanvas', this).then((res) => {
        this.setData({
          shareImg: res.tempFilePath,
          hideCanvas: true,
        }, callback)
      })
    },

    // 长按保存事件
    saveImg() {
      this.wxUtils.saveImage(this.data.shareImg, this).then(() => {
        this.hideModal()
      })
    },

    hideModal() {
      this.setData({
        showModal: false,        
      })
    },

    getRgba(value) {
      const arys = value.replace('rgba(', '').replace(')', '').split(',')
      const rgba = {
        r: arys[0],
        g: arys[1],
        b: arys[2],
        a: arys[3],
      }
      return rgba
    },
    openPixelColorPanel() {
      const rgba = this.getRgba(this.data.pixelColor)
      this.setData({
        rgba,
        showColorPanel: 'pixelColor',
      })
    },
    openBgColorPanel() {
      const rgba = this.getRgba(this.data.bgColor)
      this.setData({
        rgba,
        showColorPanel: 'bgColor',
      })
    },
    openTextColorPanel() {
      const rgba = this.getRgba(this.data.fontColor)
      this.setData({
        rgba,
        showColorPanel: 'fontColor',
      })
    },
    sliderRedChange(e) {
      this.updateRgba('r', e.detail.value)
    },
    sliderGreenChange(e) {
      this.updateRgba('g', e.detail.value)
    },
    sliderBlueChange(e) {
      this.updateRgba('b', e.detail.value)
    },
    sliderOpcityChange(e) {
      this.updateRgba('a', e.detail.value.toFixed(2))
    },
    updateRgba(type, value) {
      const rgba = {
        ...this.data.rgba,
        [type]: value
      }
      this.setData({ rgba })
    },
  }
})
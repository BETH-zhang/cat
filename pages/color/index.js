import ColorThief from '../../utils/color-thief.js'
// import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'
import colorCardTheme0 from '../../data/colorCardTheme0'
import colorCardTheme1 from '../../data/colorCardTheme1'
import colorCardTheme2 from '../../data/colorCardTheme2'
import {
  rgbToHex,
  saveBlendent,
  reverseColor,
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
    TabCur: 0,
    scrollLeft:0,
    tabs: [{
      index: 0,
      name: '添加图片',
    }, {
      index: 1,
      name: '色卡'
    }],
    themes: ['无', '模板1', '模板2', '模板3'],
    themeCur: 0,

    imgPath: null,
    shareImg: null,
    colors: [],
    colorList: [],
    imgInfo: {},
    colorCount: 7,
    state: STATE_EMPTY,
    currentColor: '',

    setting: '',
    template: {},
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
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id-1)*60
      })
    },
    themeSelect(e) {
      console.log(this.data.imgPath, this.data.shareImg)
      if (this.data.imgPath) {
        const themeCur = e.currentTarget.dataset.id
        const data = this.optPictureData()
        let template = null
        switch(themeCur) {
          case 1:
            template = new colorCardTheme0().palette(data)
            break;
          case 2:
            template = new colorCardTheme1().palette(data)
            break;
          case 3:
            template = new colorCardTheme2().palette(data)
            break;
          default:
            break;
        }
        this.setData({
          themeCur: themeCur,
          template: template,
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '先添加一张图片',
          duration: 1000,
        })
      }
    },
    SettingEventListener(e) {
      console.log(e.detail, '..SettingEventListener...', this.data.setting)
      switch(this.data.setting) {
        case 'login':
          this.setData({
            setting: '',
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
      
      // const ctx = wx.createCanvasContext('mainCanvas', this) 
      // this.appCanvas = new TestApplication(ctx, { width, height, id: 'mainCanvas' }, wx)
    },
    addImage: function() {
      this.setData({ TabCur: 0 })
      this.chooseImg()
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
              console.log('imgInfo: ', imgInfo)
              let {
                width,
                height,
                imgPath
              } = imgInfo;
              let scale = 0.9 * this.screenWidth / Math.max(width, height);
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
                if (colors) {
                  colors = colors.map((color) => {
                    return ('#' + rgbToHex(color[0], color[1], color[2]))
                  })
                  this.setData({
                    colors,
                    state: STATE_SUCCEED
                  })
                  this.saveColorCard()
                }
              });
            }
          })
        }
      }, this)
    },
    saveColorCard: function() {
      saveBlendent({colors:this.data.colors}, () => {
        wx.showToast({
          title: '色卡自动保存',
          icon: 'success'
        })
      });
      var colorList = wx.getStorageSync('colors') || []
      this.setData({ colorList })
    },
    delete: function(e) {
      var colorList = wx.getStorageSync('colors') || []
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
      if (!app.globalData.userInfo) {
        this.setData({
          setting: 'login',
          shareImg: '',
        })
      } else {
        this.optPictureData()
      }
    },

    getColorsReverse(colors) {
      if (colors.length) {
        return colors.map((item) => {
          return reverseColor(item)[1]
        })
      }
      return []
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
        name: app.globalData.userInfo.nickName,
        title: '色卡分享',
        time: time,
        imgInfo: this.data.imgInfo,
        colors: this.data.colors,
        colorsReverse: this.getColorsReverse(this.data.colors)
      }

      return data
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
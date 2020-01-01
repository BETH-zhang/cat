import ColorThief from '../../utils/color-thief.js'
import {
  rgbToHex,
  saveBlendent
} from '../../utils/util.js'
const app = getApp()
const STATE_EMPTY = 0;
const STATE_LOADING = 1;
const STATE_SUCCEED = 2;

console.log('rgbToHex: ', rgbToHex)
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    imgPath: null,
    colors: [],
    colorList: [],
    // colors: [
    //   "#153641",
    //   "#22556E",
    //   "#4799B7",
    //   "#6DB3BF",
    //   "#94CFC9"
    // ],
    imgInfo: {},
    colorCount: 7,
    state: STATE_EMPTY,
    currentColor: '',
  },
  attached() {
    console.log("color")
    // this.wxUtils = new WxUtils(wx, app)
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
  },
  methods: {
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
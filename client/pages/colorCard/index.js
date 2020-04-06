import ColorThief from '../../utils/color-thief.js'
import config from '../../config'
import { saveImage, chooseImage, downLoadImg, jumpPage } from '../../utils/wxUtils'
import { addCollection, uploadImage, add, query } from '../../api/index'
import { setImagePath, getImagePath, getTempFileURL } from '../../api/image'
import colorCardTheme0 from '../../assets/data/colorCardTheme0'
import colorCardTheme1 from '../../assets/data/colorCardTheme1'
import colorCardTheme2 from '../../assets/data/colorCardTheme2'
import {
  rgbToHex,
  reverseColor,
} from '../../utils/util.js'
const app = getApp()
const STATE_EMPTY = 0;
const STATE_LOADING = 1;
const STATE_SUCCEED = 2;

Page({
  data: {
    TabCur: 0,
    scrollLeft:0,
    tabs: [{
      index: 0,
      name: '当前色卡',
    }, {
      index: 1,
      name: '所有色卡'
    }],
    themes: ['模板1', '模板2', '模板3'],
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
  onLoad(options) {
    this.initCanvas()
    this.initData(options.id) 
  },
  initData(id) {
    if (!id) return null
    query({
      name: 'colorCard',
      data: {
        _id: id,
      },
    }).then((res) => {
      console.log(res)
      if (res.length) {
        downLoadImg(getImagePath(res[0].imgPath), this).then((imgInfo) => {
          console.log('imgInfo: ', imgInfo)
          this.setData({
            imgPath: imgInfo.path,
            imgInfo,
            colors: res[0].colors,
            id,
          })
        })
      }
    })
  },
  tabSelect(e) {
    const id =  e.target.dataset.id
    if (id) {
      jumpPage('page', 'colors')
    }
  },
  themeSelect(e) {
    console.log(this.data.imgPath, this.data.shareImg)
    if (this.data.imgPath) {
      const themeCur = e.currentTarget.dataset.id
      this.setData({ themeCur: themeCur })
      const data = this.download()
      if (data) {
        let template = null
        switch(themeCur) {
          case 0:
            template = new colorCardTheme0().palette(data)
            break;
          case 1:
            template = new colorCardTheme1().palette(data)
            break;
          case 2:
            template = new colorCardTheme2().palette(data)
            break;
          default:
            break;
        }
        this.setData({
          themeCur: themeCur,
          template: template,
        })
      }
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
        if (!e.detail.close) {
          this.themeSelect({
            currentTarget: {
              dataset: {
                id: this.data.themeCur || 1,
              }
            },
          })
        } else {
          this.setData({
            showModal: false,     
          })
        }
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

    const width = app.globalData.systemInfo.windowWidth
    const height = app.globalData.systemInfo.windowHeight
    this.setData({ width, height })
  },
  addImage: function() {
    this.setData({ TabCur: 0 })
    this.chooseImg()
  },
  chooseImg: function() {
    chooseImage({}, this).then((res) => {
      this.setData({
        imgPath: res.tempFilePaths[0],
        state: STATE_LOADING
      })
      // 上传图片
      const filePath = res.tempFilePaths[0]

      uploadImage(filePath, `${config.colorCard}/my-image`).then((res) => {
        app.globalData.fileID = res.fileID
        app.globalData.imagePath = filePath

        this.saveColorCard()
      })


      downLoadImg(res.tempFilePaths[0], this).then((imgInfo) => {
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
      })
    })
  },
  saveColorCard: function() {
    if (this.data.colors.length && app.globalData.fileID && !this.data.id) {
      console.log(this.data.colors)
      console.log(app.globalData.fileID)
      const imgPath = setImagePath(app.globalData.fileID)
      console.log(imgPath)

      add({
        name: 'colorCard',
        data: {
          colors: this.data.colors,
          imgPath,
        },
      })
    }
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
      return this.optPictureData()
    }
    return null
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
    saveImage(this.data.shareImg, this).then(() => {
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
})
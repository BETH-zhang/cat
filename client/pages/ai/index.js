import { saveImage, jumpPage } from '../../utils/wxUtils'
import ConvertPixel, { pixelContant } from '../../utils/convertPixel'
import pixelCardTheme1 from '../../assets/data/pixelCardTheme1';
const app = getApp()

console.log(pixelContant)
Page({
  data: {
    themes: [
      ['原图', '导出'],
      ['16', '像素'], ['32', '像素'], ['64', '像素'],
      // ['128', '像素'], ['256', '像素']
    ],
    themeCur: 0,

    imgPath: null,
    shareImg: null,
    imgInfo: {},

    setting: '',
    template: {},

    size: pixelContant.md,
  },
  onLoad() {
    this.initCanvas()
  },
 
  themeSelect(e) {
    console.log(this.data.imgPath, this.data.shareImg)
    if (this.data.imgPath) {
      const themeCur = e.currentTarget.dataset.id
      console.log('themeCur: ', themeCur)

      switch(themeCur) {
        case 0:
          const data = this.download()
          console.log('data: ', data)
          if (data) {
            const template =  new pixelCardTheme1().palette(data)
            this.setData({
              themeCur: themeCur,
              template: template,
            })
            clearTimeout(this.timer)
          }
          break;
        case 1:
          this.updateSize('sm') 
          break;
        case 2:
          this.updateSize('md') 
          break;
        case 3:
          this.updateSize('lg') 
          break;
        case 4:
          this.updateSize('xl') 
          break;
        case 5:
          this.updateSize('xxl') 
          break;
        default:
          break;
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
                id: this.data.themeCur || 0,
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
  initCanvas() {
    this.ConvertPixel = new ConvertPixel('cvCanvas', this)

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
  updateSize: function(size) {
    this.setData({
      size: pixelContant[size || 'lg'],
    })
    console.log(this.data.size, this.data.imgInfo)
    this.formatImageInfo(this.data.imgInfo)
  },
  formatImageInfo: function(imgInfoData) {
    const imgInfo = imgInfoData || {
      tempFilePath: "http://tmp/wx44378f03ea3692aa.o6zAJszQ4YQ5dZy0aDA8SHOSKW48.0yKIWYDNDzNVc6479873cb9f36c0b8e077b47531df22.JPG",
      width: 372,
      height: 372
    }
    console.log('imgInfo: ', imgInfo)
    const width = imgInfo.width
    const height = imgInfo.height
    const p = width / height
    let canvasWidth = p > 1 ? this.data.size : p * this.data.size;
    let canvasHeight = p < 1 ? this.data.size : this.data.size / p;
    this.setData({
      imgInfo,
      imgPath: imgInfo.tempFilePath,
      canvasWidth,
      canvasHeight,
    });
    
    wx.showLoading({
      title: '像素生成中',
    })
    this.ConvertPixel.render({
      width: canvasWidth,
      height: canvasHeight,
      imgPath: imgInfo.tempFilePath,
    }, () => {
      wx.hideLoading()
      jumpPage('page', 'pixel')
    });
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
            this.setData({
              imgInfo: {
                width: imgInfo.width,
                height: imgInfo.height,
                tempFilePath: imgInfo.path,
              },
              imgPath: imgInfo.path,
            });
          }
        })
      }
    }, this)
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
  optPictureData() {
    wx.showLoading({
      title: '图片生成中',
    })
    this.timer = setTimeout(() => {
      wx.hideLoading()
      clearTimeout(this.timer)
    }, 10000)
    const date = new Date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = year + '.' + month + '.' + day;   // 绘图的时间

    const data = {
      avatar: app.globalData.userInfo.avatarUrl,
      qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
      name: app.globalData.userInfo.nickName,
      title: '程小元像素画',
      description: '',
      time: time,
      imgInfo: this.data.imgInfo,
      bgColor: '#fff',
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
})
import { saveImage } from '../../utils/wxUtils'
import ConvertPixel from '../../utils/convertPixel'
import pixelCardTheme1 from '../../assets/data/pixelCardTheme1';
const app = getApp()

Page({
  data: {
    themes: ['模板1'],
    themeCur: 0,

    imgPath: null,
    shareImg: null,
    imgInfo: {},

    setting: '',
    template: {},
  },
  onLoad() {
    this.initCanvas()
  },
 
  themeSelect(e) {
    console.log(this.data.imgPath, this.data.shareImg)
    if (this.data.imgPath) {
      const themeCur = e.currentTarget.dataset.id
      console.log('themeCur: ', themeCur)
      const data = this.download()
      console.log('data: ', data)
      if (data) {
        let template = null
        switch(themeCur) {
          case 0:
            template = new pixelCardTheme1().palette(data)
            break;
          default:
            break;
        }

        console.log('template: ', template)
        this.setData({
          themeCur: themeCur,
          template: template,
        })
        clearTimeout(this.timer)
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
  initData() {
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
  chooseImg: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showLoading({
          title: '图片处理中',
        })
        this.setData({
          imgPath: res.tempFilePaths[0],
        })
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: (imgInfo) => {
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
            this.ConvertPixel.render({
              width: canvasWidth,
              height: canvasHeight,
              imgPath: res.tempFilePaths[0],
            }, (imgInfo) => {
              wx.hideLoading()
              this.setData({
                imgPath: imgInfo.tempFilePath,
                imgInfo,
              })
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
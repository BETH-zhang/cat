// import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'
import ConvertPixel from '../../utils/convertPixel'

const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    TabCur: 0,
    scrollLeft:0,
    tabs: [{
      index: 0,
      name: '转图',
    }, {
      index: 1,
      name: '临摹'
    }],
    themes: ['无', '模板1', '模板2', '模板3'],
    themeCur: 0,

    imgPath: null,
    shareImg: null,
    imgInfo: {},

    setting: '',
    template: {},
  },
  attached() {
    console.log("convert")
    this.initData()
  },
  lifetimes: {
    ready() {
      console.log('ready')
      this.initCanvas()
    },
    attached() {
      console.log('attached')
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
        this.setData({ themeCur: themeCur })
        const data = this.download()
        if (data) {
          let template = null
          switch(themeCur) {
            // case 1:
            //   template = new colorCardTheme0().palette(data)
            //   break;
            // case 2:
            //   template = new colorCardTheme1().palette(data)
            //   break;
            // case 3:
            //   template = new colorCardTheme2().palette(data)
            //   break;
            // default:
            //   break;
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
          this.themeSelect({
            currentTarget: {
              dataset: {
                id: this.data.themeCur || 1,
              }
            },
          })
          break
        default:
          break
      }
    },
    initData() {
      this.wxUtils = new WxUtils(wx, app)
      console.log('this.wxUtils: ', this.wxUtils)
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

      this.wxUtils = new WxUtils(wx, app)

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
                  imgPath: imgInfo.tempFilePath
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
  }
})
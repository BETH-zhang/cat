import { saveImage } from '../../utils/wxUtils'
import qrcodeTheme from '../../assets/data/qrcodeTheme';
import { getImagePath, getTempFileURL } from '../../api/image'

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
  },
 
  themeSelect(e) {
    console.log(this.data.imgPath, this.data.shareImg)
    if (this.data.imgPath) {
      const userInfo = wx.getStorageSync('userInfo') || {}
      const themeCur = e.currentTarget.dataset.id
      console.log('themeCur: ', themeCur)
      const data = this.download()
      console.log('data: ', data)
      if (data) {
        let template = null

        getTempFileURL([
          getImagePath('/home/logo-text.png'),
          getImagePath('/home/gongzhonghao_qrcode.jpeg'),
          getImagePath('/home/IMG_3740.JPG'),
        ]).then((imageRes) => {
          console.log(imageRes.fileList) 

          const aa = {
            logoText: imageRes.fileList[0].tempFileURL,
            logo: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            avatar: userInfo.avatarUrl,
            name: userInfo.nickName,
            title: '请长按下方二维码',
            subTitle: '',
            qrcode: this.data.imgPath || imageRes.fileList[1].tempFileURL,
            fingerprint: imageRes.fileList[2].tempFileURL,
            description: ''
          } 
          this.setData({
            template: new qrcodeTheme().palette(aa)
          })
        })
        // switch(themeCur) {
        //   case 0:
        //     template = new qrcodeTheme().palette(aa)
        //     break;
        //   default:
        //     break;
        // }

        // console.log('template: ', template)
        // this.setData({
        //   themeCur: themeCur,
        //   template: template,
        // })
        // clearTimeout(this.timer)
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
  chooseImg: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imgPath: res.tempFilePaths[0],
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
      return true
    }
    return null
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
const app = getApp();
import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'

Page({
  data: {
    PageCur: 'basics',
    shareImg: '',
    rgba: {
      r: 240,
      g: 113,
      b: 43,
      a: 1
    },
    pixelColor: 'rgba(240,113, 43, 1)',
    gap: 25,
    gapItems: [],
    bgColor:  'rgba(255, 255, 255, 1)',
    fontColor: 'rgba(50, 50, 50, 1)'
  },
  onLoad() {
    console.log('onLoad')
    this.initData()
    // this.initCanvas()
    this.testCanvas()
    this.selectColor(`rgba(${this.data.rgba.r}, ${this.data.rgba.g}, ${this.data.rgba.b}, ${this.data.rgba.a})`)
  },
  onReady() {
    console.log('onReady')
    console.log(app.globalData)
  },
  initData() {
    this.wxUtils = new WxUtils(wx, app)
    this.wxUtils.data
  },
  setGapItemsDefault() {
    const width = this.systemInfo.windowWidth
    const gapCounts = [5, 10, 15, 20, 25, 40]
    const gapItems = gapCounts.map((gapCount) => {
      const gap = Math.floor(width / gapCount)
      return { name: `${gapCount} 列网格`, value: gap }
    })
    gapItems.push({ name: '默认网格', value: 25 })
    this.setData({
      gapItems,
    })
  },
  radioChange(e) {
    this.closeSetting()
    const gap = Number(e.detail.value)
    this.bgCanvas.setGap(gap)
    this.bgCanvas.init(this.data.bgColor)
    this.appCanvas.setGap(gap)
    this.appCanvas.updateGrid(0, 0, '', true)
    this.setData({
      gap,
      showGridPanel: false,
    })
  },
  updateState(key, value) {
    this.setData({
      [key]: value,
    })
  },
  titleInputChange(e) {
    this.setData({
      title: e.detail.value,
    })
  },
  desInputChange(e) {
    this.setData({
      description: e.detail.value
    })
  },
  NavChange(e) {
    // this.appCanvas.updateGrid(0, 0, '', true)
    this.setData({
      PageCur: e.currentTarget.dataset.cur,
      openSetting: false,
      loading: false,
    })
  },
  openSetting() {
    // this.appCanvas.updateGrid(0, 0, '', 'grid')
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'mainCanvas',
      success: (res) => {
        let shareImg = res.tempFilePath;
        console.log('shareImg: ', shareImg)
        this.setData({
          shareImg: shareImg,
          openSetting: true,
        })
      },
      fail: function (res) {
      }
    })
  },
  closeSetting() {
    this.setData({
      openSetting: false,
    })
  },
  onShareAppMessage() {
    return {
      title: '程小元像素画',
      imageUrl: '/images/share.png',
      path: '/pages/index/index',
      success: function(res) {
        console.log('转发成功', res)
      },
      fail: function(res) {
        console.log('转发失败', res)
      },
    }
  },
  dispatchTouchStart(e) {
    if (!this.data.loading) {
      this.setData({
        show: true,
        x0: e.touches[0].x,
        y0: e.touches[0].y
      })
      this.appCanvas.updateGrid(e.touches[0].x, e.touches[0].y, this.data.pixelColor, true)
    }
  },
  dispatchTouchMove(e) {
    if (!this.data.loading) {
      this.setData({
        x: e.touches[0].x,
        y: e.touches[0].y
      })
      this.appCanvas.updateGrid(e.touches[0].x, e.touches[0].y, this.data.pixelColor, false)
      // this.bgCanvas.updateLine(this.data.x0, this.data.y0, e.touches[0].x, e.touches[0].y)
    }
  },
  dispatchTouchEnd(e) {
    if (!this.data.loading) {
      this.setData({
        show: false,
      })
      this.appCanvas.updateGrid(this.data.x, this.data.y, this.data.pixelColor, true)
      // this.bgCanvas.updateLine(0, 0, 0, 0)
    }
  },
  testCanvas() {
    this.systemInfo = null
    wx.getSystemInfo({
      success: (res) => {
        this.systemInfo = res
        this.setGapItemsDefault()
      }
    })
    const width = this.systemInfo.windowWidth
    const height = width
    const ctx = wx.createCanvasContext('mainCanvas')
    this.setData({ width, height })

    this.appCanvas = new TestApplication(ctx, { width, height })
    wx.getImageInfo({
      src: 'https://wx2.sinaimg.cn/orj360/9f7ff7afgy1g9ac546ennj20qu0kk1kx.jpg',
      success: res => {
        console.log('res: ', res)
        this.appCanvas.smartExtractPixel(res, wx)
      }
    })
  },
  initCanvas() {
    this.systemInfo = null
    wx.getSystemInfo({
      success: (res) => {
        this.systemInfo = res
        this.setGapItemsDefault()
      }
    })
    const width = this.systemInfo.windowWidth
    const height = Math.floor((this.systemInfo.windowHeight - 50) / this.data.gap) * this.data.gap
    this.setData({ width, height })
    const ctx = wx.createCanvasContext('mainCanvas')
    const ctxbg = wx.createCanvasContext('bgCanvas')
    this.bgCanvas = new TestApplication(ctxbg, { width, height })
    this.bgCanvas.setGap(this.data.gap)
    this.bgCanvas.init(this.data.bgColor)
    
    this.appCanvas = new TestApplication(ctx, { width, height })
    this.appCanvas.setGap(this.data.gap)
  },
  setShareTitle() {
    this.setData({
      showTitlePanel: true,
    })
  },
  inputTitle() {
    this.setData({
      showTitlePanel: false,
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
  selectColor() {
    this.closeSetting()
    const color = `rgba(${this.data.rgba.r}, ${this.data.rgba.g}, ${this.data.rgba.b}, ${this.data.rgba.a})`
    if (this.data.showColorPanel === 'bgColor') {
      this.bgCanvas.init(color)
    }
    this.setData({
      [this.data.showColorPanel]: color,
      showColorPanel: false,
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
  setGridGap() {
    this.setData({
      showGridPanel: true,
    })
  },
  clearPicture() {
    this.closeSetting()
    this.appCanvas.clear()
  },
  cancelLogin() {
    this.setData({
      openLoginPanel: false,
    })
  },
  onGotUserInfo (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      openLoginPanel: false,
    })
    this.savePicture()
  },
  savePicture() {
    if (!app.globalData.userInfo) {
      this.setData({
        openLoginPanel: true
      })
    } else {
      this.closeSetting()
      this.setData({
        loading: true
      })
      wx.showLoading({
        title: '图片生成中',
      })
      this.optPictureData()
    }
  },

  hideModal() {
    this.closeSetting()
    const shareCtx = wx.createCanvasContext('shareFrends');
    shareCtx.draw()
    this.setData({
      showModal: false,
      showShareModal: false,
    })
  },

  takePhoto() {
    console.log(1)
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },

  optPictureData() {
    console.log('读取图片')
    let that = this;

    const shareFrendsCtx = wx.createCanvasContext('shareFrends');    //绘图上下文
    const shareFrendsApp = new TestApplication(shareFrendsCtx, { width: this.systemInfo.windowWidth, height: this.systemInfo.windowHeight })

    const date = new Date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = year + '.' + month + '.' + day;   // 绘图的时间

    const data = {
      avatar: app.globalData.userInfo.avatarUrl,
      cover: this.data.shareImg,
      qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
      logo: '',
      name: app.globalData.userInfo.nickName,
      title: this.data.title || '程小元像素画',
      description: this.data.description || '画一副像素画，送给你',
      time: time,
    }

    wx.getImageInfo({
      src: data.cover,
      success: res => {
        data.cover = res.path

        console.log('绘制图片')
        
        wx.getImageInfo({ // 封面图
          src: data.avatar,
          success: res => {
            data.avatar = res.path
            wx.getImageInfo({
              src: data.qrcode,
              success: res => {
                data.qrcode = res.path

                shareFrendsApp.createSharePicture(data, {
                  color: this.data.bgColor,
                  fontColor: this.data.fontColor,
                })
                // canvas画图需要时间而且还是异步的，所以加了个定时器
                setTimeout(() => {
                  // 将生成的canvas图片，转为真实图片
                  console.log('生成图片')
                  wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    canvasId: 'shareFrends',
                    success: (res) => {
                      console.log('生成分享图')
                      let shareImg = res.tempFilePath;
                      that.setData({
                        shareImg: shareImg,
                        showShareModal: false,
                        loading: false,
                        showModal: true,
                        openSetting: true,
                      })
                      wx.hideLoading()
                    },
                    fail: function (res) {
                      console.log('res', res)
                    }
                  })
                }, 500)
              }
            })
          },
          fail(err) {
            console.log(err)
          }
        })
      },
      fail(err) {
        console.log('avatar-err: ', err)
      }
    })
  },

  // 长按保存事件
  saveImg() {
    let that = this;
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.shareImg,
                success() {
                  wx.showToast({
                    title: '保存成功'
                  })
                },
                fail() {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail() {
            // 如果用户拒绝过或没有授权，则再次打开授权窗口
            //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              that.setData({
                openSet: true
              })
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: that.data.shareImg,
            success() {
              wx.showToast({
                title: '保存成功'
              })
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  // 授权
  cancleSet() {
    this.setData({
      openSet: false
    })
  },
  // onReady: function () {
  //   this.position = {
  //     x: 150,
  //     y: 150,
  //     vx: 2,
  //     vy: 2
  //   }

  //   this.drawBall()
  //   this.interval = setInterval(this.drawBall, 17)
  // },
  // drawBall: function () {
  //   var p = this.position
  //   p.x += p.vx
  //   p.y += p.vy
  //   if (p.x >= 300) {
  //     p.vx = -2
  //   }
  //   if (p.x <= 7) {
  //     p.vx = 2
  //   }
  //   if (p.y >= 300) {
  //     p.vy = -2
  //   }
  //   if (p.y <= 7) {
  //     p.vy = 2
  //   }

  //   var context = wx.createContext()

  //   function ball(x, y) {
  //     context.beginPath(0)
  //     context.arc(x, y, 5, 0, Math.PI * 2)
  //     context.setFillStyle('#1aad19')
  //     context.setStrokeStyle('rgba(1,1,1,0)')
  //     context.fill()
  //     context.stroke()
  //   }

  //   ball(p.x, 150)
  //   ball(150, p.y)
  //   ball(300 - p.x, 150)
  //   ball(150, 300 - p.y)
  //   ball(p.x, p.y)
  //   ball(300 - p.x, 300 - p.y)
  //   ball(p.x, 300 - p.y)
  //   ball(300 - p.x, p.y)

  //   wx.drawCanvas({
  //     canvasId: 'homeCanvas',
  //     actions: context.getActions()
  //   })
  // },
  // onUnload: function () {
  //   clearInterval(this.interval)
  // }
})
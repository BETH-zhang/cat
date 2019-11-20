const app = getApp();
import TestApplication from '../../utils/canvasApplication'

Page({
  data: {
    PageCur: 'basics',
    shareImg: '111',
    rgba: {
      r: 240,
      g: 113,
      b: 43,
      a: 1
    },
    fontColor: 'white'
  },
  onLoad() {
    console.log('onLoad')
    this.initCanvas()
    this.selectColor(`rgba(${this.data.rgba.r}, ${this.data.rgba.g}, ${this.data.rgba.b}, ${this.data.rgba.a})`)
  },
  onReady() {
    console.log('onReady')
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '抖音像素画',
      imageUrl: '/images/share.jpg',
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
    this.setData({
      show: true,
      x0: e.touches[0].x,
      y0: e.touches[0].y
    })
    this.appCanvas.updateGrid(e.touches[0].x, e.touches[0].y, this.data.color, true)
  },
  dispatchTouchMove(e) {
    this.setData({
      x: e.touches[0].x,
      y: e.touches[0].y
    })
    this.appCanvas.updateGrid(e.touches[0].x, e.touches[0].y, this.data.color, false)
    // this.bgCanvas.updateLine(this.data.x0, this.data.y0, e.touches[0].x, e.touches[0].y)
  },
  dispatchTouchEnd(e) {
    this.setData({
      show: false,
    })
    this.appCanvas.updateGrid(this.data.x, this.data.y, this.data.color, true)
    // this.bgCanvas.updateLine(0, 0, 0, 0)
  },
  initCanvas() {
    this.systemInfo = null
    wx.getSystemInfo({
      success: (res) => {
        this.systemInfo = res
      }
    })
    const ctx = wx.createCanvasContext('mainCanvas')
    const ctxbg = wx.createCanvasContext('bgCanvas')
    this.bgCanvas = new TestApplication(ctxbg, { width: this.systemInfo.windowWidth, height: this.systemInfo.windowHeight })
    this.bgCanvas.setGap(25)
    this.bgCanvas.init()
    
    this.appCanvas = new TestApplication(ctx, { width: this.systemInfo.windowWidth, height: this.systemInfo.windowHeight })
    // console.log('TestApplication: ', this.appCanvas, systemInfo)
    this.appCanvas.setGap(25)
  },
  openColorPanel() {
    this.setData({
      showColorPanel: true,
    })
  },
  selectColor() {
    this.setData({
      color: `rgba(${this.data.rgba.r}, ${this.data.rgba.g}, ${this.data.rgba.b}, ${this.data.rgba.a})`,
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
    let cb = 0
    if (rgba.r > 200) {
      cb += 1
    }
    if (rgba.g > 200) {
      cb += 1
    }
    if (rgba.b > 200) {
      cb += 1
    }
    if (rgba.a < 0.5) {
      cb += 2
    }
    this.setData({ rgba, fontColor: cb >= 2 ? 'black' : 'white' })
  },
  clearPicture() {
    this.appCanvas.clear()
  },
  savePicture() {
    wx.showLoading({
      title: '图片生成中',
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'mainCanvas',
      success: (res) => {
        let shareImg = res.tempFilePath;
        this.setData({
          shareImg: shareImg,
        })
        this.optPictureData()
      },
      fail: function (res) {
      }
    })
  },

  hideModal() {
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
      qrcode: 'https://s2.ax1x.com/2019/11/20/MfsqZF.jpg',
      name: app.globalData.userInfo.nickName,
      title: this.data.title || '抖音像素画',
      description: this.data.description || '画一副像素画，送给你',
      time: time,
    }

    wx.getImageInfo({
      src: data.avatar,
      success: res => {
        data.avatar = res.path

        // data.cover = res.path
        // data.qrcode = res.path

        // shareFrendsApp.createSharePicture(data)
        wx.getImageInfo({ // 封面图
          src: data.cover,
          success: res => {
            data.cover = res.path
            wx.getImageInfo({
              src: data.qrcode,
              success: res => {
                data.qrcode = res.path

                shareFrendsApp.createSharePicture(data)
                // canvas画图需要时间而且还是异步的，所以加了个定时器
                setTimeout(() => {
                  // 将生成的canvas图片，转为真实图片
                  console.log(1)
                  wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    canvasId: 'shareFrends',
                    success: (res) => {
                      console.log(2)
                      let shareImg = res.tempFilePath;
                      that.setData({
                        shareImg: shareImg,
                        showModal: true,
                        showShareModal: false
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
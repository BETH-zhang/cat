const app = getApp();
import TestApplication from '../../utils/canvasApplication'

Page({
  data: {
    PageCur: 'basics',
    shareImg: '111',
    rgba: {
      r: 255,
      g: 0,
      b: 0,
      a: 1
    },
    fontColor: 'white'
  },
  onLoad() {
    console.log('onLoad')
    setTimeout(() => {
      this.initCanvas()
    }, 0)
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
      x: e.touches[0].x,
      y: e.touches[0].y
    })
    this.appCanvas.update(e.touches[0].x, e.touches[0].y, this.data.color)
  },
  dispatchTouchMove(e) {
    this.setData({
      x: e.touches[0].x,
      y: e.touches[0].y
    })
    this.appCanvas.update(e.touches[0].x, e.touches[0].y, this.data.color)
  },
  dispatchTouchEnd(e) {
    this.setData({
      show: false,
    })
  },
  initCanvas() {
    let systemInfo = null
    wx.getSystemInfo({
      success: (res) => {
        console.log('getSystemInfo-res: ', res)
        systemInfo = res
      }
    })
    const ctx = wx.createCanvasContext('mainCanvas')
    const ctxbg = wx.createCanvasContext('bgCanvas')
    const bgCanvas = new TestApplication(ctxbg, { width: systemInfo.windowWidth, height: systemInfo.windowHeight })
    bgCanvas.setGap(25)
    bgCanvas.init()
    
    this.appCanvas = new TestApplication(ctx, { width: systemInfo.windowWidth, height: systemInfo.windowHeight })
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
        console.log("shareImg: ", shareImg)
        this.setData({
          shareImg: shareImg,
          showModal: true,
          showShareModal: false,
        })
        wx.hideLoading()
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
  shareFrends() {
    wx.showLoading({
      title: '图片生成中',
    })
    let that = this;
    const detail = this.data.detail;   // 海报图的的一些信息，从后台请求的数据
    let avatar;// 头像
    const post_cover = detail.post_cover || '../../imgs/cars.png'; //没有封面图时设置默认图片
    wx.$.fetch('api/setLocalAvatar', { //请求头像的地址
      method: 'post',
      hideLoading: true,
      showLoading: true,
      data: {
        api_token: wx.getStorageSync('token'),
        member_id: detail.member.member_id,
      }
    }).then(res => {
      avatar = res.data.url;
      wx.getImageInfo({   // 根据头像地址下载头像并存为临时路径
        src: avatar,
        success: res => {
          that.setData({
            avatar: res.path
          })
          wx.getImageInfo({ // 封面图
            src: post_cover,
            success: res => {
              //如果是本地图片的话此api返回的路径有问题，所以需要判断是否是网络图片
              if (!/^https/.test(post_cover)) {
                res.path = post_cover
              };
              that.setData({
                cover: res.path,
                coverWidth: res.width,  //封面图的宽
                coverHeight: res.height //封面图的高
              })
              wx.$.fetch('api/getQrCode', { //获取二维码图片
                method: 'post',
                hideLoading: true,
                showLoading: true,
                data: {
                  path: 'pages/topicdetail/index?id=' + this.data.id,
                  post_id: this.data.id,
                  width: 340
                }
              }).then(res => {
                wx.getImageInfo({
                  src: res.data.path,
                  success: res => {
                    that.setData({
                      erweima: res.path
                    })

                    that.createdCode() // 根据以上信息开始画图
                    //canvas画图需要时间而且还是异步的，所以加了个定时器
                    setTimeout(() => {
                     // 将生成的canvas图片，转为真实图片
                      // wx.canvasToTempFilePath({
                      //   x: 0,
                      //   y: 0,
                      //   canvasId: 'shareFrends',
                      //   success: function (res) {
                      //     let shareImg = res.tempFilePath;
                      //     that.setData({
                      //       shareImg: shareImg,
                      //       showModal: true,
                      //       showShareModal: false
                      //     }
                      //     wx.hideLoading()
                      //   },
                      //   fail: function (res) {
                      //   }
                      // })
                    }, 500)
                  }
                })
              })
            },
            fail(err) {
              console.log(err)
            }
          })
        }
      })
    })
  },

  //开始绘图
  createdCode() {
    let that = this;
    const detail = this.data.detail;
    const ctx = wx.createCanvasContext('shareFrends');    //绘图上下文
    const date = new Date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = year + '.' + month + '.' + day;   // 绘图的时间
    const name = detail.post_title;     //绘图的标题  需要处理换行
    const coverWidth = this.data.coverWidth; // 封面图的宽度 裁剪需要
    const coverHeight = this.data.coverHeight; // 封面图的宽度 裁剪需要
    let pichName = detail.member.name;  //用户昵称
    const explain = 'Hi,我想分享给你一条资讯猛料!';
    // 截取昵称 超出省略。。。
    if (pichName.length > 16) {   //用户昵称显示一行 截取
      pichName = pichName.slice(0, 9) + '...'
    };
    // 绘制logo
    ctx.save()
    // canvas 背景颜色设置不成功，只好用白色背景图
    ctx.drawImage('/imgs/canvas-bg.jpg', 0, 0, 286, 480);  
    //绘制logo
    ctx.drawImage('/imgs/share-logo.png', 140, 25, 128, 34);

    // 绘制时间
    ctx.setFontSize(12);
    ctx.setTextAlign('right');
    const metrics = ctx.measureText(time).width;   //时间文字的所占宽度
    ctx.fillText(time, 266, 78, metrics + 5);
    // 绘制 封面图并裁剪（这里图片确定是按100%宽度，同时高度按比例截取，否则图片将会变形）
    // 裁剪位置  图片上的坐标  x:0 ,y: (coverHeight - 129 * coverWidth / 252) / 2
    // 图片比例 255:129   图片宽度按原图宽度即coverWidth  图片高度按129*coverWidth/252
    // 开始绘图的位置  16, 94
    // 裁剪框的大小，即需要图片的大小 252, 129
    ctx.drawImage(this.data.cover, 0, (coverHeight - 129 * coverWidth / 252) / 2, coverWidth, 129*coverWidth/252 , 16, 94, 252, 129);

    // 绘制标题
    ctx.font = 'normal bold 14px sans-serif';
    ctx.setTextAlign('left');
    const nameWidth = ctx.measureText(name).width;
    // 标题换行  16是自已定的，为字体的高度
    this.wordsWrap(ctx, name, nameWidth, 252, 16, 252, 16);  
    // 计算标题所占高度
    const titleHight = Math.ceil(nameWidth / 252) * 16;  
    // 绘制头像和昵称
    ctx.arc(36, 268 + titleHight, 20, 0, 2 * Math.PI);
    ctx.clip()
    ctx.drawImage(this.data.avatar, 16, 248 + titleHight, 40, 44);
    ctx.restore();
    ctx.font = 'normal normal 14px sans-serif';
    ctx.setTextAlign('left');
    ctx.setFillStyle('#bbbbbb')
    ctx.fillText(pichName, 70, 270 + titleHight);
    // 二维码描述  及图片
    ctx.setStrokeStyle('#eeeeee');
    ctx.strokeRect(16, 300 + titleHight, 252, 80);
    ctx.setFillStyle('#333333')
    ctx.fillText(explain.slice(0, 11), 30, 336 + titleHight);   // 描述截取换行
    ctx.fillText(explain.slice(11), 30, 358 + titleHight);

    ctx.drawImage(this.data.erweima, 194, 308 + titleHight, 44, 44);
    ctx.setFontSize(10);
    ctx.setFillStyle('#bbbbbb')
    ctx.fillText('长按扫码查看详情', 175, 370 + titleHight);
    ctx.draw()
  },

  //文字换行处理
  // canvas 标题超出换行处理
  wordsWrap(ctx, name, nameWidth, maxWidth, startX, srartY, wordsHight) {
    let lineWidth = 0;
    let lastSubStrIndex = 0;
    for (let i = 0; i < name.length; i++) {
      lineWidth += ctx.measureText(name[i]).width;
      if (lineWidth > maxWidth) {
        ctx.fillText(name.substring(lastSubStrIndex, i), startX, srartY);
        srartY += wordsHight;
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == name.length - 1) {
        ctx.fillText(name.substring(lastSubStrIndex, i + 1), startX, srartY);
      }
    }
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
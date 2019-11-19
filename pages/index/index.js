Page({
  data: {
    PageCur: 'basics'
  },
  onLoad() {
    console.log('index')
    this.renderCanvas()
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '文饼日常',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
  renderCanvas() {
    const ctx = wx.createCanvasContext('mainCanvas')
    console.log('home-ctx: ', ctx)
    ctx.setFillStyle('red')
    ctx.fillRect(10, 10, 150, 75)
    ctx.draw(false, function (e) {
      console.log('draw callback')
    })
    
    const grd = ctx.createCircularGradient(75, 50, 50)
    grd.addColorStop(0, 'red')
    grd.addColorStop(1, 'white')

    // Fill with gradient
    ctx.setFillStyle(grd)
    ctx.fillRect(10, 10, 150, 80)
    ctx.draw()
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
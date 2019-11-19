const app = getApp();

Page({
  options: {
    addGlobalClass: true,
  },
  data: {},
  onLoad() {
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
  onReady() {
    console.log('onReady')
  },
})
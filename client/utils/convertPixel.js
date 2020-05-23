export const pixelContant = {
  xm: 10,
  sm: 16,
  md: 32,
  lg: 64,
  xl: 128,
  xxl: 256,
}

class ConvertPixel {
  constructor(canvasId, that) {
    this.canvasId = canvasId
    this.that = that
    this.ctx = wx.createCanvasContext(this.canvasId, this.that);
    this.ctxBig = wx.createCanvasContext(`${this.canvasId}Big`, this.that)

    this.threshold = 255
    this.mode = 0 // 0 彩色 1 黑白
    this.interval = 50
    this.numberGird = 50
  }

  setParams = () => {}

  // 阈值处理
  thresholdConvert = (imageData, callback) => {
    const data = imageData.data
    // console.log(data)
    // 225600 300 188
    // 225600 / 4 === 300 * 188

    this.interval = Math.floor(imageData.width / this.numberGird)
    // console.log('this.interval: ', this.interval)

    const colorData = []
    let row = 0
    let col = 0
    for (var i = 0; i < data.length; i += 4) {
      row = Math.floor(((i / 4) % imageData.width))
      col = Math.floor(i / (imageData.width * 4))
      const red = data[i]
      const green = data[i + 1]
      const blue = data[i + 2]
      const alpha = data[i + 3]
      
      colorData.push({x: row, y: col, color: `rgba(${red},${green},${blue},${alpha})`})
    }

    // console.log('colorData: ', colorData)
    wx.setStorage({
      key: 'offsetX',
      data: 0,
    })
    wx.setStorage({
      key: 'offsetY',
      data: 0,
    })
    wx.setStorage({
      key: 'pixelData',
      data: colorData,
    })

    console.log('setStorage: ', wx.getStorageSync('pixelData')[0])
    if (callback) {callback()} 
  }

  render = ({ width, height, imgPath }, callback) => {
    this.ctx.drawImage(imgPath, 0, 0, width, height)

    // 绘制
    this.ctx.draw(false, () => {
      console.log('绘制缩放图')

      // 获取缩放图数据
      wx.canvasGetImageData({
        canvasId: `${this.canvasId}`,
        x: 0,
        y: 0,
        width: width,
        height: height,
        quality: 0,
        success: (res) => {
          console.log('获取缩放图信息', res)
          console.log(res.width) // 100
          console.log(res.height) // 100
          console.log(res.data instanceof Uint8ClampedArray) // true
          console.log(res.data.length) // 100 * 100 * 4

          // 阈值处理
          this.thresholdConvert(res, callback)
        },
      }, this.that)
    })
  }
}

export default ConvertPixel
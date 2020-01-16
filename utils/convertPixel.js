class ConvertPixel {
  constructor(canvasId, that) {
    this.canvasId = canvasId
    this.that = that
    this.ctx = wx.createCanvasContext(this.canvasId, this.that);

    this.threshold = 255
    this.scale = 0.09
    this.mode = 0 // 0 彩色 1 黑白
  }

  setParams = () => {}

  // 阈值处理
  thresholdConvert = (imageData) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i]
      const green = data[i + 1]
      const blue = data[i + 2]
      const alpha = data[i + 3]

      // 灰度计算公式
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      const color = gray >= this.threshold ? 255 : 0

      data[i]     = (this.mode === 0 && color === 0) ? red : color
      data[i + 1] = (this.mode === 0 && color === 0) ? green : color
      data[i + 2] = (this.mode === 0 && color === 0) ? blue : color
      data[i + 3] = alpha >= this.threshold ? 255 : 0
    }

    return imageData
  }

  render = ({ width, height, imgPath }) => {
    // 画板缩小
    // this.canvas.width = width * this.scale
    // this.canvas.height = height * this.scale
    const scaleWidth = width * this.scale
    const scaleHeight = height * this.scale
    this.ctx.drawImage(imgPath, 0, 0, scaleWidth, scaleHeight)

    // 绘制
    this.ctx.draw(false, () => {
      console.log('draw end')
      wx.canvasGetImageData({
        canvasId: this.canvas,
        x: 0,
        y: 0,
        width: width,
        height: height,
        success(res) {
          console.log('getImgData', res);
          console.log(res.width) // 100
          console.log(res.height) // 100
          console.log(res.data instanceof Uint8ClampedArray) // true
          console.log(res.data.length) // 100 * 100 * 4

          // 阈值处理
          const imageData = this.thresholdConvert(res)
          console.log('imageData: ', imageData)
          // this.ctx.putImageData(imageData, 0, 0)
          wx.canvasPutImageData({
            canvasId: this.canvasId,
            x: 0,
            y: 0,
            width: scaleWidth,
            height: scaleHeight,
            data: new Uint8ClampedArray(imageData)
          })
          this.ctx.draw(true)
        },
      })
    })
  }
}

export default ConvertPixel
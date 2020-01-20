class ConvertPixel {
  constructor(canvasId, that) {
    this.canvasId = canvasId
    this.that = that
    this.ctx = wx.createCanvasContext(this.canvasId, this.that);
    this.ctxBig = wx.createCanvasContext(`${this.canvasId}Big`, this.that)

    this.threshold = 255
    this.scale = 0.25
    this.mode = 0 // 0 彩色 1 黑白
    this.interval = 50
    this.numberGird = 25
  }

  setParams = () => {}

  // 阈值处理
  thresholdConvert = (imageData, callback) => {
    console.log('-imageData: ', imageData)
    const data = imageData.data
    console.log(data.length, imageData.width, imageData.height)
    // 225600 300 188
    // 225600 / 4 === 300 * 188

    this.interval = Math.floor(imageData.width / this.numberGird)
    console.log('this.interval: ', this.interval)

    for (var i = 0; i < data.length; i += 4) {
      const row = Math.floor(i / 4 / imageData.width)
      const col = i / 4 % imageData.width
      const rowRemainder = row % this.interval
      const colRemainder = col % this.interval

      if (rowRemainder && colRemainder) {
        const rowStart = Math.floor(row / this.interval) * this.interval
        const colStart = Math.floor(col / this.interval) * this.interval
        const index = (colStart - 1) * imageData.width * 4 + rowStart * 4
        const alpha = 255

        data[index] = Math.min(data[i], data[index])
        data[index + 1] = Math.min(data[i + 1], data[index + 1])
        data[index + 2] = Math.min(data[i + 2], data[index + 2])

        // 灰度计算
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        const color = gray >= this.threshold ? 255 : 0

        // data[i] = (this.mode === 0 && color === 0) ? data[index] : color
        // data[i + 1] = (this.mode === 0 && color === 0) ? data[index + 1] : color
        // data[i + 2] = (this.mode === 0 && color === 0) ? data[index + 2] : color
        // data[i + 3] = alpha >= this.threshold ? 255 : 0
        data[i] = data[index]
        data[i + 1] = data[index + 1]
        data[i + 2] = data[index + 2]
        data[i + 3] = 255

      } else {
        data[i] = 255
        data[i + 1] = 255
        data[i + 2] = 255
        data[i + 3] = 255 
      }
    }

    wx.canvasPutImageData({
      canvasId: `${this.canvasId}Big`,
      x: 0,
      y: 0,
      width: imageData.width,
      height: imageData.height,
      data: new Uint8ClampedArray(data),
      success: (res) => {
        console.log('绘制处理后的缩放图', res)
        this.ctxBig.draw(true, () => {
          callback()
        })
      },
    }, this.that)
  }

  drawPixel = ({ tempFilePath, width, height }, callback) => {
    this.ctxBig.drawImage(tempFilePath, 0, 0, width, height)
    this.ctxBig.draw(false, () => {
      wx.canvasGetImageData({
        canvasId: `${this.canvasId}Big`,
        x: 0,
        y: 0,
        width: width,
        height: height,
        success: (res) => {
          console.log('获取缩放图信息', res)
          console.log(res.width) // 100
          console.log(res.height) // 100
          console.log(res.data instanceof Uint8ClampedArray) // true
          console.log(res.data.length) // 100 * 100 * 4
          // 阈值处理
          this.thresholdConvert(res, () => {
            wx.canvasToTempFilePath({
              canvasId: `${this.canvasId}Big`,
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              complete: (res) => {
                const imageFile = {
                  tempFilePath: res.tempFilePath,
                  width: width,
                  height: height,
                }
                callback(imageFile)
              }
            }, this.that)
          })
        },
      }, this.that)
    })
  }

  render = ({ width, height, imgPath }, callback) => {
    // 画板缩小
    const scaleWidth = width * this.scale
    const scaleHeight = height * this.scale
    this.ctx.drawImage(imgPath, 0, 0, scaleWidth, scaleHeight)

    // 绘制
    this.ctx.draw(false, () => {
      console.log('绘制缩放图小图')
      wx.canvasToTempFilePath({
        canvasId: this.canvasId,
        x: 0,
        y: 0,
        width: scaleWidth,
        height: scaleHeight,
        destWidth: scaleWidth,
        destHeight: scaleHeight,
        complete: (res) => {
          const imageFile = {
            tempFilePath: res.tempFilePath,
            width: width,
            height: height,
          }
          console.log('获取缩放小图文件', imageFile)
          this.drawPixel(imageFile, (imgPath) => {
            if (callback) {
              callback(imgPath)
            }
          })
        }
      }, this.that)
    })
  }
}

export default ConvertPixel
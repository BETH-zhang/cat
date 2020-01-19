class ConvertPixel {
  constructor(canvasId, that) {
    this.canvasId = canvasId
    this.that = that
    this.ctx = wx.createCanvasContext(this.canvasId, this.that);
    this.ctxBig = wx.createCanvasContext(`${this.canvasId}Big`, this.that)

    this.threshold = 255
    this.scale = 0.09
    this.mode = 0 // 0 彩色 1 黑白
    this.interval = 20
  }

  setParams = () => {}

  updateImageData = (data, cellData) => {
    const total = this.interval * this.interval
    let redTotal = 0
    let greenTotal = 0
    let blueTotal = 0
    let alphaTotal = 0

    for (let i = 0; i < cellData.length; i++) {
      for (let j = cellData[i][0]; j < cellData[i][1]; j += 4) {
        const red = data[j]
        const green = data[j + 1]
        const blue = data[j + 2]
        const alpha = data[j + 3]

        // 灰度计算公式
        const gray = 0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2]
        const color = gray >= this.threshold ? 255 : 0

        data[j]     = (this.mode === 0 && color === 0) ? red : color
        data[j + 1] = (this.mode === 0 && color === 0) ? green : color
        data[j + 2] = (this.mode === 0 && color === 0) ? blue : color
        data[j + 3] = alpha >= this.threshold ? 255 : 0

        redTotal += data[j]
        greenTotal += data[j + 1]
        blueTotal += data[j + 2]
        alphaTotal += data[j + 3]
      }
    }

    for (let i = 0; i < cellData.length; i++) {
      for (let j = cellData[i][0]; j < cellData[i][1]; j += 4) {
        data[j]     = redTotal / total
        data[j + 1] = greenTotal / total
        data[j + 2] = blueTotal / total
        data[j + 3] = alphaTotal / total
      }
    }
  }

  // 阈值处理
  thresholdConvert = (imageData) => {
    console.log('-imageData: ', imageData)
    const data = imageData.data
    console.log(data.length, imageData.width, imageData.height)
    // 225600 300 188
    // 225600 / 4 === 300 * 188
    const row = Math.floor(imageData.height / this.interval)
    const col = Math.floor(imageData.width / this.interval)
    for (let i = 0; i < row.length; i++) {
      for (let j = 0; j < col.length; j++) {
        console.log(i, j)
        const cellData = []
        for (let ic = 0; ic < this.interval; ic++) {
          cellData.push([ic * (imageData.width * 4), ic * (imageData.width * 4) + this.interval * 4])
        }
        this.updateImageData(data, cellData)
      }
    }

    // for (let i = 0; i < data.length; i += 4) {
    //   // if (i < 516 && i < 499) {
    //   //   console.log('start---', data[i], data[i + 1], data[i + 2], data[i + 3])
    //   // }
    //   const red = data[i]
    //   const green = data[i + 1]
    //   const blue = data[i + 2]
    //   const alpha = data[i + 3]

    //   // 灰度计算公式
    //   const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    //   const color = gray >= this.threshold ? 255 : 0

    //   data[i]     = (this.mode === 0 && color === 0) ? red : color
    //   data[i + 1] = (this.mode === 0 && color === 0) ? green : color
    //   data[i + 2] = (this.mode === 0 && color === 0) ? blue : color
    //   data[i + 3] = alpha >= this.threshold ? 255 : 0
    //   // if (i < 516 && i < 499) {
    //   //   console.log('end---', data[i], data[i + 1], data[i + 2], data[i + 3])
    //   // }
    // }

    wx.canvasPutImageData({
      canvasId: `${this.canvasId}Big`,
      x: 0,
      y: 0,
      width: imageData.width,
      height: imageData.height,
      data: new Uint8ClampedArray(data),
      success: (res) => {
        console.log('绘制处理后的缩放图', res)
        this.ctxBig.draw(true)
      },
    }, this.that)
  }

  drawPixel = ({ tempFilePath, width, height }) => {
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
          this.thresholdConvert(res)
        },
      }, this.that)
    })
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
          this.drawPixel(imageFile)
        }
      }, this.that)
    })
  }
}

export default ConvertPixel
class ImageProcess {
  constructor(canvas, ctx, data) {
    this.canvas = canvas
    this.ctx = ctx
    this.data = data
    this.threshold = 128 // 0 ~ 255
    this.scale = 0.25
    this.mode = 0 // 1 黑白 0 彩色
  }

  pixelate = (imageData) => {
    this.canvas.width = imageData.width * this.scale
    this.canvas.height = imageData.height * this.scale
    
    // var imageData = this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)

    // 阈值处理
    const newImageData = this.thresholdConvert(imageData)
    this.ctx.putImageData(newImageData, 0, 0)
  }

  thresholdConvert = (imageData) => {
    const data = imageData.data
    for (var i = 0; i < data.length; i += 4) {
      const red = data[i]
      const green = data[i + 1]
      const blue = data[i + 2]
      const alpha = data[i + 3]

      // 灰度计算
      var gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]

      const color = gray >= this.threshold ? 255 : 0

      data[i] = (this.mode === 0 && color === 0) ? red : color
      data[i + 1] = (this.mode === 0 && color === 0) ? green : color
      data[i + 2] = (this.mode === 0 && color === 0) ? blue : color
      data[i + 3] = alpha >= this.threshold ? 255 : 0
    }
    return imageData
  }
}
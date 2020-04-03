
class DrawApplication {
  constructor(ctx, canvas, that) {
    this.ctx = ctx
    this.canvas = this.canvas
    this.that = that
    this.color = 'white'
  }

  update = (options = {}) => {
    Object.keys(options).forEach((key) => {
      this[key] = options[key]
    })
  }

  check = () => {
    if (this.ctx === null) {
      return
    }
  }

  fillRect = (x, y, width, height, fillStyle = this.color) => {
    this.check()
    this.ctx.save()
    this.ctx.setFillStyle(fillStyle)
    this.ctx.fillRect(x, y, width, height)
    this.ctx.restore()
  }

  drawImage = (img, destRect = {}, srcRect = {}) => {
    this.check()
    this.ctx.drawImage(img,
      // 源
      srcRect.x,
      srcRect.y,
      srcRect.width,
      srcRect.height,
      // 目标
      destRect.x,
      destRect.y,
      destRect.width,
      destRect.height,
    )
  }
}

export default DrawApplication
class PixelApplication {
  constructor(ctx, canvas, that) {
    // 网格坐标
    this.ctx = ctx
    this.canvas = canvas
    this.that = that

    this.toolType = 'brush' // brush eraser straw
    this.bgColor = 'white'
    this.color = 'black'

    this.numberGird = 16
    this.numberGird_Y = 16
    this.interval = 0
    this.offsetX = 0
    this.offsetY = 0

    this.height = 0
    this.step = -1
    this.touchX = 0;
    this.touchY = 0;
    this.canvasHistory = [];

    this.init()
  }

  update = (options = {}) => {
    Object.keys(options).forEach((key) => {
      this[key] = options[key]
    })
  }

  init = () => {
    this.interval = (this.canvas.width / this.numberGird);
    this.numberGird_Y = Math.floor(this.canvas.height / this.interval)
    this.height = this.numberGird_Y * this.interval
  }

  initGrid = () => {
    this.ctx.setFillStyle(this.bgColor);
    this.ctx.fillRect(0, 0, this.canvas.width, this.height);

    this.ctx.setLineWidth(0.5);
    this.ctx.setStrokeStyle('grey');
    for (var i = 0; i <= this.numberGird; i++) {
      this.ctx.moveTo(i * this.interval, 0);
      this.ctx.lineTo(i * this.interval, this.height);
    }
    for (var i = 0; i <= this.numberGird_Y; i++) {
      this.ctx.moveTo(0, i * this.interval);
      this.ctx.lineTo(this.canvas.width, i * this.interval);
    }

    this.ctx.stroke();
    this.ctx.draw(false, function(){
      console.log("画板绘制完成")
    });
  }

  drawPixel = (x, y) => {
    var px = x < this.interval ? 0 : parseInt(x / this.interval) * this.interval;
    var py = y < this.interval ? 0 : parseInt(y / this.interval) * this.interval;

    if (this.toolType === 'brush') {
      this.ctx.setFillStyle(this.color);
      this.ctx.fillRect(px - this.offsetX, py - this.offsetY, this.interval, this.interval);
    } else if (this.toolType === 'eraser') {
      this.ctx.clearRect(px - this.offsetX, py - this.offsetY, this.interval, this.interval);
    }
    this.ctx.draw(true);
  }

  recoredOperation = (callback) => {
    this.step += 1;
    if (this.step < this.canvasHistory.length) {
      this.canvasHistory.length = this.step + 1;
    }

    wx.canvasGetImageData({
      canvasId: this.canvas.id,
      x: 0,
      y: 0,
      width: this.canvas.width + this.offsetX,
      height: this.canvas.height + this.offsetY,
      success: (res) => {
        this.canvasHistory.push(res.data)
        console.log(res.data)
        if (callback) { callback() } 
      },
      fail: () => {
        console.log("canvasGetImageData fail")
      }
    }, this.that)
  }

  // 绘制开始
  touchStart = (e) => {
    this.touchX = e.touches[0].x; // 获取触摸时的原点  
    this.touchY = e.touches[0].y; // 获取触摸时的原点
    if (this.touchX > this.canvas.width || this.touchY > this.height){
      return;
    }
    
    this.drawPixel(this.touchX, this.touchY);
  }

  // 绘制过程中
  touchMove = (e) => {
    this.touchX = e.touches[0].x;
    this.touchY = e.touches[0].y;
    if (this.touchX > this.canvas.width || this.touchY > this.height) {
      return;
    }
    this.drawPixel(this.touchX, this.touchY);
  }

  // 绘制结束
  touchEnd = (callback) => {
    this.recoredOperation(callback)
  }

  straw = (e, callback) => {
    const x = e.touches[0].x
    const y = e.touches[0].y
    wx.canvasGetImageData({
      canvasId: this.canvas.id,
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      success: (res) => {
        const data = res.data
        const index = (y - 1) * this.canvas.width * 4 + x * 4

        console.log(index, `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${data[index + 3]})`)
        this.color = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${data[index + 3]})`
        if (callback) {callback(this.color)}
      },
    }, this.that)
  }

  // 撤销
  undo = (callback) => {
    console.log(this.step, this.canvasHistory)
    this.step--;
    if (this.step > -1){
      const imgData = this.canvasHistory[this.step];
      wx.canvasPutImageData({
        canvasId: this.canvas.id,
        data: imgData,
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height,
        success(res){
          console.log('undo success')
          if (callback) { callback() }
        }
      }, this.that)
    } else {
      this.clean(callback)
    }
  }

  // 恢复
  restore = () => {
    if (this.step < this.canvasHistory.length - 1){
      this.step++;
      const imgData = this.canvasHistory[this.step];
      wx.canvasPutImageData({
        canvasId: this.canvas.id,
        data: imgData,
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height,
        success(res) {
          console.log('restore success')
        }
      }, this.that)
    }
  }

  // 清除
  clean = (callback) => {
    this.ctx.draw(false)
    this.canvasHistory = []
    this.step = -1

    if (callback) { callback() }
  }
}

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

export const Pixel = PixelApplication
export const Draw = DrawApplication

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
    this.interval = 25

    // 移动标示
    this.startX = 0
    this.startY = 0
    // this.offsetX = wx.getStorageSync('offsetX') || 0
    // this.offsetY = wx.getStorageSync('offsetY') || 0
    this.offsetX = 100
    this.offsetY = 100

    this.height = 0
    this.step = -1
    this.touchX = 0;
    this.touchY = 0;
    this.canvasHistory = [];

    this.point = null
    this.data = wx.getStorageSync('pixelData') || [{"x":3,"y":11,"color":"#081921"},{"x":4,"y":11,"color":"#081921"},{"x":5,"y":12,"color":"#081921"},{"x":6,"y":12,"color":"#081921"},{"x":6,"y":13,"color":"#081921"},{"x":7,"y":13,"color":"#081921"},{"x":7,"y":14,"color":"#081921"},{"x":7,"y":15,"color":"#081921"},{"x":3,"y":15,"color":"#081921"},{"x":4,"y":15,"color":"#081921"},{"x":5,"y":15,"color":"#081921"},{"x":6,"y":15,"color":"#081921"},{"x":7,"y":16,"color":"#081921"},{"x":7,"y":17,"color":"#081921"},{"x":9,"y":10,"color":"#081921"},{"x":10,"y":11,"color":"#081921"},{"x":10,"y":12,"color":"#081921"},{"x":11,"y":13,"color":"#081921"},{"x":11,"y":14,"color":"#081921"},{"x":11,"y":15,"color":"#081921"},{"x":3,"y":4,"color":"#081921"},{"x":4,"y":4,"color":"#081921"},{"x":5,"y":4,"color":"#081921"},{"x":6,"y":5,"color":"#081921"},{"x":7,"y":5,"color":"#081921"},{"x":7,"y":6,"color":"#081921"},{"x":8,"y":6,"color":"#081921"},{"x":9,"y":7,"color":"#081921"},{"x":10,"y":8,"color":"#081921"},{"x":2,"y":6,"color":"#D9B43F"},{"x":2,"y":7,"color":"#D9B43F"},{"x":3,"y":7,"color":"#D9B43F"},{"x":3,"y":8,"color":"#D9B43F"},{"x":4,"y":8,"color":"#D9B43F"},{"x":4,"y":9,"color":"#D9B43F"},{"x":5,"y":9,"color":"#D9B43F"},{"x":5,"y":10,"color":"#D9B43F"},{"x":6,"y":10,"color":"#D9B43F"},{"x":4,"y":5,"color":"#D9B43F"},{"x":5,"y":5,"color":"#D9B43F"},{"x":5,"y":6,"color":"#D9B43F"},{"x":6,"y":6,"color":"#D9B43F"},{"x":7,"y":7,"color":"#D9B43F"},{"x":7,"y":8,"color":"#D9B43F"},{"x":8,"y":8,"color":"#D9B43F"},{"x":8,"y":9,"color":"#D9B43F"},{"x":9,"y":9,"color":"#D9B43F"}]

    this.init()
  }

  update = (options = {}) => {
    Object.keys(options).forEach((key) => {
      this[key] = options[key]
    })
  }

  init = () => {
    this.interval = (this.canvas.width / this.numberGird);
    console.log('this.interval', this.interval)
    this.numberGird_Y = Math.floor(this.canvas.height / this.interval)
    this.height = this.numberGird_Y * this.interval
  }

  initGrid = () => {
    this.ctx.translate(this.offsetX, this.offsetY);

    this.ctx.setFillStyle(this.bgColor);
    this.ctx.fillRect(0, 0, this.canvas.width, this.height);

    this.ctx.setLineWidth(0.5);
    this.ctx.setStrokeStyle('grey');
    
    const cc = Math.floor(this.offsetX / this.interval)
    const rc = Math.floor(this.offsetY / this.interval)
    console.log(this.offsetX, this.offsetY)
    console.log(cc, rc)
    for (var i = -cc; i <= this.numberGird - cc; i++) {
      this.ctx.moveTo(i * this.interval, -rc * this.interval);
      this.ctx.lineTo(i * this.interval, this.canvas.height);
    }
    for (var i = -rc; i <= this.numberGird_Y - rc; i++) {
      this.ctx.moveTo(-cc * this.interval, i * this.interval);
      this.ctx.lineTo(this.canvas.width - cc * this.interval, i * this.interval);
    }

    this.ctx.stroke();

    this.draw()
  }

  drawPixel = (x, y) => {
    var px = x < this.interval ? 0 : parseInt(x / this.interval) * this.interval;
    var py = y < this.interval ? 0 : parseInt(y / this.interval) * this.interval;

    if (this.toolType === 'brush') {
      this.ctx.setFillStyle(this.color);
      this.ctx.fillRect(px, py, this.interval, this.interval);
    } else if (this.toolType === 'eraser') {
      this.ctx.clearRect(px, py, this.interval, this.interval);
    }
    this.ctx.draw(true);
  }

  draw = () => {
    this.data.forEach((item) => {
      const x = item.x * this.interval
      const y = item.y * this.interval
      if (
        x + this.offsetX >= -this.interval &&
        x + this.offsetX <= this.canvas.width &&
        y + this.offsetY >= -this.interval &&
        y + this.offsetY <= this.canvas.height
      ) {
        this.ctx.setFillStyle(item.color);
        this.ctx.fillRect(x + 1, y + 1, this.interval - 2, this.interval - 2);
      }
    })
    this.ctx.draw();
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
      width: this.canvas.width,
      height: this.canvas.height,
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

  // 开始移动
  touchMoveStart = (e) => {
    this.startX = Math.floor(e.touches[0].x)
    this.startY = Math.floor(e.touches[0].y)
  }

  touchMoveMove = (e) => {
    const x = Math.floor(e.touches[0].x)
    const y = Math.floor(e.touches[0].y)
    this.offsetX += (x - this.startX)
    this.offsetY += (y - this.startY)
    this.startX = x
    this.startY = y
    this.initGrid()
  }

  touchMoveEnd = (e) => {
    if (this.point) {
      const index = this.data.findIndex(item => {
        return item.x === this.point.x && item.y === this.point.y;
      })
      if (index > -1) {
        this.data.splice(index, 1)
      }
      if (this.toolType !== 'eraser') {
        this.data.push(this.point)
      }
      this.draw()
    }

    wx.setStorage({
      key: 'offsetX',
      data: this.offsetX,
    })
    wx.setStorage({
      key: 'offsetY',
      data: this.offsetY,
    })
    wx.setStorage({
      key: 'pixelData',
      data: this.data,
    })
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

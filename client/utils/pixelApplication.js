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

    // this.offsetX = wx.getStorageSync('offsetX') || 0
    // this.offsetY = wx.getStorageSync('offsetY') || 0
    this.startPoint = { x: 0, y: 0 }
    this.offsetX = 0
    this.offsetY = 0
    this.zoom = 1

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
    this.ctx.fillRect(-this.offsetX, -this.offsetY, this.canvas.width, this.canvas.height);

    this.ctx.setLineWidth(0.5);
    this.ctx.setStrokeStyle('grey');
    
    const cc = Math.floor(this.offsetX / this.interval)
    const rc = Math.floor(this.offsetY / this.interval)
    console.log(this.offsetX, this.offsetY)
    console.log(cc, rc, this.numberGird)

    this.ctx.moveTo((1 - cc) * this.interval, (-rc - 1) * this.interval)
    this.ctx.lineTo((1 - cc) * this.interval, -rc * this.interval + this.canvas.height)
    for (var i = 1 - cc; i <= this.numberGird - cc; i++) {
      this.ctx.moveTo(i * this.interval, (-rc - 1) * this.interval);
      this.ctx.lineTo(i * this.interval, -rc * this.interval + this.canvas.height);
    }
    for (var i = -rc - 1; i <= this.numberGird_Y - rc; i++) {
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

  fillRect = (x, y, w, h, fillStyle = this.color) => {
    this.ctx.setFillStyle(fillStyle);
    this.ctx.fillRect(x, y, w, h);
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
        this.fillRect(x + 1, y + 1, this.interval - 2, this.interval - 2, item.color)
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

    this.recoredOperation(callback)
  }

  // 开始移动
  touchMoveStart = (e) => {
    const p1 = e.touches[0]
   
    this.update({
      startPoint: {
        x: p1.x - this.offsetX,
        y: p1.y - this.offsetY,
        rowIdx: Math.floor((p1.x - this.offsetX) / this.interval),
        colIdx: Math.floor((p1.y - this.offsetY) / this.interval),
        offsetX: Math.floor((p1.x - this.offsetX) / this.interval) * this.interval,
        offsetY: Math.floor((p1.y - this.offsetY) / this.interval) * this.interval,
      },
    }) 

    if (e.touches.length === 1) {
      
    } else if (e.touches.length > 1) {
      const p1 = e.touches[0]
      const p2 = e.touches[1]

      this.update({
        startPoint: {
          x: Math.sqrt(Math.pow((p1.x + p2.x) / 2, 2)) - this.offsetX,
          y: Math.sqrt(Math.pow((p1.y + p2.y) / 2, 2)) - this.offsetY,
          distance: Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)),
        },
      })
    }
  }

  touchMoveMove = (e) => {
    const p1 = e.touches[0]
    const distance = Math.sqrt(Math.pow(p1.x - this.startPoint.x, 2) + Math.pow(p1.y - this.startPoint.y, 2))
    // this.zoom = 1 - distance * 0.005
    this.zoom = 1 + distance * 0.005
    console.log('rowIdx: ', this.startPoint.rowIdx, this.startPoint.colIdx)
    this.interval = Math.max(Math.min(this.interval * this.zoom, 50), 12)
    this.numberGird = Math.floor(this.canvas.width / this.interval)
    this.offsetX = this.startPoint.offsetX - this.startPoint.rowIdx * this.interval
    this.offsetY = this.startPoint.offsetY - this.startPoint.colIdx * this.interval

    this.init()
    this.initGrid()

    if (e.touches.length > 1) {
      const p1 = e.touches[0]
      const p2 = e.touches[1]

      const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
      const zoom = Math.max(0, distance / this.startPoint.distance)

      // 获取偏移值
      this.update({
        offsetX: Math.sqrt(Math.pow((p1.x + p2.x) / 2, 2)) - this.startPoint.x,
        offsetY: Math.sqrt(Math.pow((p1.y + p2.y) / 2, 2)) - this.startPoint.y,
        zoom,
        offsetStartX: this.startPoint.x * zoom - this.startPoint.x,
        offsetStartY: this.startPoint.y * zoom - this.startPoint.y,
      })
      
      this.initGrid()
    }
  }

  touchMoveEnd = (e) => {
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

export default PixelApplication

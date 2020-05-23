import { canvasToTempFilePath } from './wxUtils'

class PixelApplication {
  constructor(ctx, canvas, that) {
    // 网格坐标
    this.ctx = ctx
    this.canvas = canvas
    this.that = that

    this.toolType = 'brush' // brush eraser straw
    this.bgColor = wx.getStorageSync('bgColor') || 'white'
    this.color = wx.getStorageSync('color') || 'black'

    this.numberGird = 16
    this.numberGird_Y = 16
    this.interval = 25

    this.offsetX = wx.getStorageSync('offsetX') || 0
    this.offsetY = wx.getStorageSync('offsetY') || 0
    this.startPoint = { x: 0, y: 0 }
    this.zoom = 1

    this.height = 0
    this.step = -1
    this.canvasHistory = [];

    this.point = null
    this.data = wx.getStorageSync('pixelData') || []
    console.log('this.data: ', this.data)

    this.init()
  }

  update = (options = {}) => {
    Object.keys(options).forEach((key) => {
      this[key] = options[key]
    })
  }

  init = () => {
    this.interval = (this.canvas.width / this.numberGird)
    this.numberGird_Y = Math.floor(this.canvas.height / this.interval)
    this.height = this.numberGird_Y * this.interval
  }

  initGrid = () => {
    this.ctx.translate(this.offsetX, this.offsetY);

    this.ctx.setFillStyle(this.bgColor);
    this.ctx.fillRect(-this.offsetX, -this.offsetY, this.canvas.width, this.canvas.height);

    this.ctx.setLineWidth(0.5);
    this.ctx.setStrokeStyle('grey');
    
    const cc = Math.floor(this.offsetX / this.interval) + 1
    const rc = Math.floor(this.offsetY / this.interval) + 1

    for (var i = 0 - cc; i <= this.numberGird - cc + 1; i++) {
      this.ctx.moveTo(i * this.interval, - rc * this.interval);
      this.ctx.lineTo(i * this.interval, this.canvas.height - (rc - 1) * this.interval);
    }
    for (var i = 0 - rc; i <= this.numberGird_Y - rc + 1; i++) {
      this.ctx.moveTo(- cc * this.interval, i * this.interval);
      this.ctx.lineTo(this.canvas.width - (cc - 1) * this.interval, i * this.interval);
    }

    this.ctx.stroke();

    this.draw()
  }

  drawPixel = (x, y) => {
    if (this.toolType === 'brush') {
      this.fillPixelGrid(x + this.offsetX, y + this.offsetY, this.color)
    } else if (this.toolType === 'eraser') {
      // this.ctx.clearRect(x + this.offsetX + 1, y + this.offsetY + 1, this.interval - 2, this.interval - 2);
      this.fillPixelGrid(x + this.offsetX, y + this.offsetY, this.bgColor) 
    }
    this.ctx.draw(true);
  }

  fillPixelGrid = (x, y, fillStyle = this.color) => {
    this.ctx.setFillStyle(fillStyle);
    this.ctx.fillRect(x + 1, y + 1, this.interval - 2, this.interval - 2);
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
        this.fillPixelGrid(x, y, item.color)
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
        // console.log(res.data)
        if (callback) { callback() } 
      },
      fail: () => {
        console.log("canvasGetImageData fail")
      }
    }, this.that)
  }

  updatePoint = (point) => {
    const index = this.data.findIndex(item => {
      return item.x == point.x && item.y == point.y;
    })
    if (index > -1) {
      this.data.splice(index, 1);
    }
    if (this.toolType === 'brush') {
      this.data.push(point);
    }
  }

  // 绘制开始
  touchStart = (e) => {
    const { x, y } = this.formatPoint(e.touches[0])
    this.point = { x, y, color: this.color };
    this.startPoint = { x, y }

    this.initGrid()
  }

  // 绘制过程中
  touchMove = (e) => {
    this.point = null;
    const { x, y } = this.formatPoint(e.touches[0])
    if (Math.abs(x - this.startPoint.x) >= 1 || Math.abs(y - this.startPoint.y) >= 1) {
      if (Math.abs(x - this.startPoint.x) > Math.abs(y - this.startPoint.y)) {
        for (let i = 0; i < Math.abs(x - this.startPoint.x); i++) {
          const point = {
            x: this.startPoint.x + (x - this.startPoint.x) / Math.abs(x - this.startPoint.x) * i,
            y: this.startPoint.y + Math.round((y - this.startPoint.y) / Math.abs(x - this.startPoint.x) * i),
            color: this.color,
          }
          this.updatePoint(point)
        }
      } else {
        for (let i = 0; i < Math.abs(y - this.startPoint.y); i++) {
          const point = {
            x: this.startPoint.x + Math.round((x - this.startPoint.x) / Math.abs(y - this.startPoint.y) * i),
            y: this.startPoint.y + (y - this.startPoint.y) / Math.abs(y - this.startPoint.y) * i,
            color: this.color
          }
          this.updatePoint(point) 
        }
      }

      this.startPoint = { x, y }
      this.initGrid()
    }
  }

  // 绘制结束
  touchEnd = (callback) => {
    if (this.point) {
      this.updatePoint(this.point)
      this.initGrid()
      this.point = null
    }

    wx.setStorage({
      key: 'pixelData',
      data: this.data,
    })

    // this.recoredOperation(callback)
    if (callback) {callback(this.data)}
  }

  // 开始移动
  touchMoveStart = (e) => {
    // const p1 = e.touches[0]
   
    // this.update({
    //   startPoint: {
    //     x: p1.x - this.offsetX,
    //     y: p1.y - this.offsetY,
    //     rowIdx: Math.floor((p1.x - this.offsetX) / this.interval),
    //     colIdx: Math.floor((p1.y - this.offsetY) / this.interval),
    //     offsetX: p1.x / this.interval,
    //     offsetY: p1.y / this.interval,
    //   },
    // }) 

    if (e.touches.length > 1) {
      const p1 = e.touches[0]
      const p2 = e.touches[1]
      const p = {
        x: Math.sqrt(Math.pow((p1.x + p2.x) / 2, 2)),
        y: Math.sqrt(Math.pow((p1.y + p2.y) / 2, 2)),
      }

      this.update({
        startPoint: {
          x: p.x - this.offsetX,
          y: p.y - this.offsetY,
          distance: Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)),
          offsetX: p.x / this.interval,
          offsetY: p.y / this.interval,
        },
      })
    }
  }

  touchMoveMove = (e) => {
    // const p1 = e.touches[0]
    // const distance = Math.sqrt(Math.pow(p1.x - this.startPoint.x, 2) + Math.pow(p1.y - this.startPoint.y, 2))
    // this.zoom = 1 + distance * 0.005
    // console.log('startPoint: ', this.startPoint)
    // this.interval = Math.max(Math.min(this.interval * this.zoom, 50), 12)
    // this.numberGird = Math.floor(this.canvas.width / this.interval)
    // this.offsetX = p1.x - this.startPoint.offsetX * this.interval
    // this.offsetY = p1.y - this.startPoint.offsetY * this.interval
    // console.log(this.offsetX, this.offsetY)

    // this.init()
    // this.initGrid()

    if (e.touches.length > 1) {
      const p1 = e.touches[0]
      const p2 = e.touches[1]
      const p = {
        x: Math.sqrt(Math.pow((p1.x + p2.x) / 2, 2)),
        y: Math.sqrt(Math.pow((p1.y + p2.y) / 2, 2)),
      }

      const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
      const zoom = Math.max(0, distance / this.startPoint.distance)
      // this.interval = (zoom > 1 ? this.interval + zoom * 0.5 + 1 : this.interval - (zoom + 1) * 5)
      // if (this.interval > 25) {
      //   this.interval = 25
      // } else if (this.interval < 12) {
      //   this.interval = 12
      // }
      // this.numberGird = Math.floor(this.canvas.width / this.interval)
      this.offsetX = p.x - this.startPoint.x
      this.offsetY = p.y - this.startPoint.y

      this.init() 
      this.initGrid()
    }
  }

  touchMoveEnd = (e) => {
    wx.setStorage({
      key: 'offsetX',
      data: this.offsetX,
    })
    wx.setStorage({
      key: 'offsetY',
      data: this.offsetY,
    })
  }

  formatPoint = (point) => {
    // console.log('移动前：', Math.floor(point.x / this.interval), Math.floor(point.y / this.interval))
    // console.log('移动后：', Math.floor((point.x - this.offsetX) / this.interval), Math.floor((point.y - this.offsetY) / this.interval))
    return {
      x: Math.floor((point.x - this.offsetX) / this.interval),
      y: Math.floor((point.y - this.offsetY) / this.interval)
    }
  }

  reset = () => {
    this.offsetX = 0
    this.offsetY = 0
    this.numberGird = 16
    this.numberGird_Y = 16
    this.interval = 25

    this.init()
    this.initGrid()
  }

  straw = (e, callback) => {
    const { x, y } = this.formatPoint(e.touches[0])
    let currentPoint = this.data.find((item) => {
      return item.x === x && item.y === y;
    });

    this.color = currentPoint ? currentPoint.color : this.color
    if (callback) {callback(this.color)}

    // wx.canvasGetImageData({
    //   canvasId: this.canvas.id,
    //   x: 0,
    //   y: 0,
    //   width: this.canvas.width,
    //   height: this.canvas.height,
    //   success: (res) => {
    //     const data = res.data
    //     const index = (y - 1) * this.canvas.width * 4 + x * 4

    //     console.log(index, `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${data[index + 3]})`)
    //     this.color = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${data[index + 3]})`
    //     if (callback) {callback(this.color)}
    //   },
    // }, this.that)
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
    wx.showModal({
      title: '温馨提示',
      content: '确定要清空画布吗？',
      cancelText: "再想想",
      confirmText: "立刻马上",
      success: (res) => {
        if (res.confirm) {
          this.data = []
          this.reset() 
          if (callback) { callback() }
        }
      }
    })
  }

  //预览图
  preview(data, bgColor, callback){
    this.ctx.setFillStyle(bgColor || this.bgColor);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    if (data.length > 0) {
      minX = data[0].x;
      minY = data[0].y;
      maxX = data[0].x;
      maxY = data[0].y;
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].x < minX) {
        minX = data[i].x + 1
      }
      if (data[i].y < minY) {
        minY = data[i].y + 1
      }
      if (data[i].x > maxX) {
        maxX = data[i].x
      }
      if (data[i].y > maxY) {
        maxY = data[i].y
      }
    }
    let tx = minX;
    let ty = minY;
    let mv = tx;
    if (tx > ty) {
      mv = ty;
    }
    let width = maxX - minX + 1;
    let height = maxY - minY + 1;
    let interval = 0;
    if (width >= height) {
      interval = Math.floor(this.canvas.width / width);
    } else {
      interval = Math.floor(this.canvas.height / height);
    }
    if (interval < 1) {
      interval = 1;
    }

    if (width > height) {
      this.ctx.translate(0, (width - height) * interval / 2);
    } else {
      this.ctx.translate((height - width) * interval / 2, 0);
    }
    for (let i = 0; i < data.length; i++) {
      this.ctx.setFillStyle(data[i].color);
      this.ctx.fillRect((data[i].x - tx) * interval, (data[i].y - ty) * interval, interval, interval);
    }
    this.ctx.draw(false, () => {
      if (callback) {
        canvasToTempFilePath(this.canvas.id, {
          x: 0,
          y: 0,
          width: this.canvas.width,
          height: this.canvas.height,
        }, this).then((res) => {
          callback({
            shareImg: res.tempFilePath,
            imgInfo: {
              ...res,
              width: this.canvas.width,
              height: this.canvas.height,
            },
          })
        })
      }
    });
  }
}

export default PixelApplication

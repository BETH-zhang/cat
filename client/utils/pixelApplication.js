class Pixel {
  constructor(ctx, canvas) {
    // 网格坐标
    this.ctx = ctx
    this.canvas = canvas

    this.toolType = 'brush' // brush eraser straw
    this.bgColor = 'white'
    this.color = 'black'

    this.numberGird = 16
    this.numberGird_Y = 16
    this.interval = 0

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
    this.canvas.height = this.numberGird_Y * this.interval
  }

  initGrid = () => {
    this.ctx.setFillStyle('white');
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.setLineWidth(0.5);
    this.ctx.setStrokeStyle('grey');
    for (var i = 0; i <= this.numberGird; i++) {
      this.ctx.moveTo(i * this.interval, 0);
      this.ctx.lineTo(i * this.interval, this.canvas.height);
    }
    for (var i = 0; i <= this.numberGird_Y; i++) {
      this.ctx.moveTo(0, i * this.interval + 1);
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
      context.setFillStyle(this.color);
      context.fillRect(px, py, this.interval, this.interval);
    } else if (this.toolType === 'eraser') {
      context.clearRect(px, py, this.interval, this.interval);
    }
    context.draw(true);
  }

  recoredOperation = () => {
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
      success(res) {
        this.canvasHistory.push(res.data)
        console.log(res.data)
      },
      fail(){
        console.log("canvasGetImageData fail")
      }
    })
  }

  // 绘制开始
  touchStart = (e) => {
    this.touchX = e.touches[0].x; // 获取触摸时的原点  
    this.touchY = e.touches[0].y; // 获取触摸时的原点
    if (this.touchX > this.canvas.width || this.touchY > this.canvas.width){
      return;
    }
    
    this.drawPixel(this.touchX, this.touchY);
  }

  // 绘制过程中
  touchMove = (e) => {
    this.touchX = e.touches[0].x;
    this.touchY = e.touches[0].y;
    if (this.touchX > this.canvas.width || this.touchY > this.canvas.width) {
      return;
    }
    this.drawPixel(this.touchX, this.touchY);
  }

  // 绘制结束
  touchEnd = (e) => {
    this.recoredOperation()
  }

  // 撤销
  undo = () => {
    if (this.step > 0){
      this.step--;
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
        }
      })
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
      })
    }
  }

  // 清除
  clear = () => {
    this.ctx.draw(false)
  }
}

export default Pixel
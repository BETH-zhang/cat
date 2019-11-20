import { throttle } from './util.js'

class TestApplication {
  constructor(ctx, canvas) {
    this.ctx = ctx
    this.canvas = canvas
    this.interval = 10
    this.data = []
    this.print()
    ctx.setFillStyle('rgba(255, 255, 255, 0)')
  }

  check = () => {
    if (this.ctx === null) {
      return
    }
  }

  print = (api) => {
    const apis = Object.keys(this.ctx)
    if (api) {
      const names = []
      apis.forEach((key) => {
        if (key.toLowerCase().indexOf(api.toLowerCase()) > -1) {
          names.push(key)
        }
      })
      console.log(api, '-- 映射 --', names)
    } else {
      console.log('apis', apis)
    }
  }

  checkApi = (names) => {
    if (names) {
      names.forEach((name) => {
        this.print(name)
      })
    }
  }

  strokeLine = (x0, y0, x1, y1) => {
    this.check()
    this.ctx.beginPath()
    this.ctx.moveTo(x0, y0)
    this.ctx.lineTo(x1, y1)
    this.ctx.stroke()
  }

  fillCircle = (x, y, radius, fillStyle = 'red') => {
    this.check()
    this.ctx.save()
    this.ctx.setFillStyle(fillStyle)
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }

  fillRect = (x, y, width, height, fillStyle = 'red') => {
    this.check()
    this.ctx.save()
    this.ctx.setFillStyle(fillStyle)
    this.ctx.fillRect(x, y, width, height)
    this.ctx.restore()
  }

  strokeCoord = (originX, originY, width, height) => {
    this.check()
    this.ctx.save()
    // 红色 x 轴
    this.ctx.setStrokeStyle('red')
    this.strokeLine(originX, originY, originX + width, originY)
    // 蓝色 y 轴
    this.ctx.setStrokeStyle('blue')
    this.strokeLine(originX, originY, originX, originY + height)
    this.ctx.restore()
  }

  strokeGrid = (color = 'grey', interval = 10, showCoord) => {
    this.interval = interval
    this.check()

    this.ctx.save()
    this.ctx.setStrokeStyle(color)
    this.ctx.setLineWidth(0.5)
    // 从左到右每隔interval个像素画一条垂直线
    for (let i = interval + 0.5; i < this.canvas.width; i += interval) {
      this.strokeLine(i, 0, i, this.canvas.height)
    }

    // 从上到下画水平线
    for (let i = interval + 0.5; i < this.canvas.height; i += interval) {
      this.strokeLine(0, i, this.canvas.width, i)
    }
    this.ctx.restore()

    if (showCoord) {
      // 绘制网格背景全局坐标系的原点
      this.fillCircle(0, 0, 5, 'green')
      // 绘制全局坐标系
      this.strokeCoord(0, 0, this.ctx.width, this.ctx.height)
    }
  }

  init = () => {
    // this.checkApi(['save', 'strokeStyle', 'lineWidth', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'restore', 'fillStyle', 'arc', 'fill'])
    // console.log(this.ctx)

    // this.ctx.setFillStyle('red')
    // this.ctx.fillRect(10, 10, 150, 75)
    // this.ctx.draw(false, function (e) {
    //   console.log('draw callback')
    // })

    // this.strokeLine(0, 0, 200, 200)
    // this.fillCircle(100, 100, 20, 'green')
    // this.strokeCoord(100, 100, 100, 100)
    this.strokeGrid('grey', this.interval)
    this.ctx.draw()
  }

  setGap = (value) => {
    this.interval = value || 10
  }

  calCoord = (x, y) => {
    return `${Math.floor(x / this.interval) * this.interval},${Math.floor(y / this.interval) * this.interval}`
  }

  draw = () => {
    this.data.forEach((item) => {
      const ary = item[0].split(',')
      this.fillRect(ary[0], ary[1], this.interval, this.interval, item[1])
    })
    this.ctx.draw()
  }

  clear = () => {
    this.data = []
    this.draw()
  }

  throttleDraw = throttle(this.draw, 0, 1000)

  update = (x, y, color) => {    
    const coord = this.calCoord(x, y)
    this.data.push([coord, color])
    this.draw()
  }
}

export default TestApplication
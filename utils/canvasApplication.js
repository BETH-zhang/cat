import { throttle } from './util.js'

const EImageFillType = {
  STRETCH: 'STRETCH',
  STRETCH_CENTER: 'STRETCH_CENTER',
  REPEAT: 'REPEAT',
  REPEAT_X: 'REPEAT_X',
  REPEAT_Y: 'REPEAT_Y',
  CENTER: 'CENTER',
}

class TestApplication {
  constructor(ctx, canvas, wx) {
    this.ctx = ctx
    this.canvas = canvas
    this.wx = wx
    this.interval = 12
    // this.arr = []
    this.data = ''
    this.color = 'red'
    this.bgColor = 'white'
    this.colors = [this.color]
    this.tx = 0
    this.ty = 0
    // this.print()
    // this.checkAllApi()
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
      return names
    } else {
      console.log('apis', apis)
    }
  }

  checkApi = (names) => {
    if (names) {
      const data = []
      names.forEach((name) => {
        data.push(` | ${name} | ${this.print(name)}`)
      })
      console.log(this.ctx, this.canvas)
      console.log(data.join('\n'))
    }
  }

  checkAllApi = () => {
    this.checkApi([
      'save',
      'lineWidth',
      'lineCap',
      'lineJoin',
      'lineDashOffset',
      'font',
      'strokeStyle',
      'fillStyle',
      'rect',
      'arc',
      'beginPath',
      'moveTo',
      'lineTo',
      'closePath',
      'stroke',
      'fill',
      'rotate',
      'translate',
      'scale',
      'restore',
      'drawImage',
      'imageData',
      'getImageData',
      'putImageData',
      'clearRect',
    ])
  }

  strokeLine = (x0, y0, x1, y1) => {
    this.check()
    this.ctx.beginPath()
    this.ctx.moveTo(x0, y0)
    this.ctx.lineTo(x1, y1)
    this.ctx.stroke()
  }

  strokeRect = (x, y, width, height, strokeStyle = 'grey') => {
    this.check()
    this.ctx.save()
    this.ctx.setStrokeStyle(strokeStyle)
    this.ctx.setLineWidth(0.5)
    this.ctx.strokeRect(x, y, width, height)
    this.ctx.restore()
  }

  fillCircle = (x, y, radius, fillStyle = this.color) => {
    this.check()
    this.ctx.save()
    this.ctx.setFillStyle(fillStyle)
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }

  fillRect = (x, y, width, height, fillStyle = this.color) => {
    this.check()
    this.ctx.save()
    this.ctx.setFillStyle(fillStyle)
    this.ctx.fillRect(x, y, width, height)
    this.ctx.restore()
  }

  drawImage = (img, destRect = {}, srcRect = {}, fillType = EImageFillType.STRETCH) =>  {
    this.check()

    if (fillType === EImageFillType.STRETCH_CENTER) {
      console.log('stretch_center')
    } else if (fillType === EImageFillType.CENTER) {
      console.log('center')
    } else if (fillType === EImageFillType.STRETCH) {
      // 分为stretch和repeat两种法方式
      console.log('stretch')
      this.ctx.drawImage(img,
        srcRect.x,
        srcRect.y,
        srcRect.width,
        srcRect.height,
        destRect.x,
        destRect.y,
        destRect.width,
        destRect.height,
      )
    } else {
      // 使用repeat模式
      console.log('repeat')
      // 调用Math.floor方法 round ceil
      let rows = Math.ceil(destRect.width / srcRect.width)
      let colums = Math.ceil(destRect.height / srcRect.height)
      // 下面6个变量在行列双重循环中每次都会更新
      // 表示的是当前要绘制的区域的位置与尺寸
      let left = 0
      let top = 0
      let right = 0
      let bottom = 0
      let width = 0
      let height = 0
      // 计算出目标Rectangle的right和bottom坐标
      let destRight = destRect.x + destRect.width
      let destBottom = destRect.y + destRect.height
      // REPEAT_X 和 REPEAT_Y 是REPEAT的一种特殊形式
      if (fillType === EImageFillType.REPEAT_X) {
        colums = 1
      } else if (fillType === EImageFillType.REPEAT_Y) {
        rows = 1
      }
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < colums; j++) {
          // 如何计算第i行第j列的坐标
          left = destRect.x + j * srcRect.width;
          top = destRect.y + j * srcRect.height;
          width = srcRect.width
          height = srcRect.height

          // 计算出当前要绘制的区域的右下坐标
          right = left + width
          bottom = top + height
          if (right > destRect) {
            width = srcRect.width - (right - destRect)
          }
          if (bottom > destBottom) {
            height = srcRect.heigt - (bottom - destBottom)
          }

          this.ctx.drawImage(img, srcRect.x, srcRect.y, width, height, left, top, width, height)
        }
      }
    }
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

  strokeGrid = (color = 'rgba(0, 0, 0, 0.3)', interval = 10, showCoord) => {
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

  createBg = () => {
    this.fillRect(0, 0, this.canvas.width, this.canvas.height, this.bgColor)
  }

  init = (color) => {
    console.log('init')
    this.bgColor = color
    this.clean()
    this.createBg()
    this.strokeGrid('grey', this.interval)
    this.strokeGrid('grey', Math.floor(this.interval * 5))
    this.ctx.draw()
  }

  setColor = (color) => {
    this.color = color || this.color
  }

  setGap = (interval) => {
    this.interval = interval || this.interval
  }

  calCoord = (x, y) => {
    const i = Math.floor(x / this.interval)
    const j = Math.floor(y / this.interval)
    return `${i}-${j}`
  }

  draw = () => {
    const data = this.data.split(' ')
    if (this.data && data.length) {
      data.forEach((item) => {
        if (item) {
          const ary = item.split('-')
          this.fillRect(ary[0] * this.interval, ary[1] * this.interval, this.interval, this.interval, this.colors[ary[2]])
        }
      })
      this.ctx.draw(true)
    }
  }

  undo = () => {
    if (this.data) {
      const str = this.getStr(this.data.length - 2, -1)
      console.log('str: ', str)
      this.data = this.data.replace(str + ' ', '')

      // this.arr.pop()
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      // if (this.arr.length > 0) {
      //   this.wx.canvasPutImageData({
      //     canvasId: this.canvas.id,
      //     x: 0,
      //     y: 0,
      //     width: this.canvas.width,
      //     height: this.canvas.height,
      //     data: this.arr,
      //     success(res) {
      //       console.log('put-res: ', res)
      //       console.log('undo-draw-true')
      //       this.ctx.draw(true)
      //     },
      //     fail(res){console.log(res)}
      //   })
      // }
    }
  }

  clean = () => {
    console.log('clean')
    this.data = ''
    this.colors = [this.color]
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.draw(true)
  }

  getStr = (index, sort) => {
    let str = ''
    if (sort === 1) {
      for (let i = index; i < this.data.length; i++) {
        str += this.data[i]
        if (this.data[i] === ' ') {
          return str
        }
      }
    } else if (sort === -1) {
      for (let i = index; i > -1; i--) {
        if (this.data[i] === ' ') {
          return str
        } else {
          str = this.data[i] + str
        }
      }
    }
  }

  eraser = (x, y) => {
    if (x && y) {
      const coord = this.calCoord(x, y)
      const startIndex = this.data.indexOf(coord)
      if (startIndex > -1) {
        const str = this.getStr(startIndex, 1)
        this.data = this.data.replace(str, '')
      }
      const coordAry = coord.split('-')
      const x0 = coordAry[0] * this.interval
      const y0 = coordAry[1] * this.interval
      this.ctx.clearRect(x0, y0, this.interval, this.interval)
      // this.fillRect(x0, y0, this.interval, this.interval, this.bgColor)
      // this.strokeRect(x0 + 0.5, y0 + 0.5, this.interval, this.interval)
      // console.log('eraser-draw-true')
      this.ctx.draw(true)
    }
  }

  updateArr = () => {
    // console.log('---', this.canvas.id, this.wx)
    // const that = this
    // this.wx.canvasGetImageData({
    //   canvasId: this.canvas.id,
    //   x: 0,
    //   y: 0,
    //   width: this.canvas.width,
    //   height: this.canvas.height,
    //   success(res) {
    //     console.log("res:", res)
    //     that.data.push(res)
    //   },
    //   fail(res) {
    //     console.log("faild",res)
    //   }
    // })
  }

  throttleDraw = throttle(this.draw, 0, 1000)

  throttleUpdateArr = throttle(this.updateArr, 0, 100)

  reDraw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.draw()    
  }

  getCoords = (x, y, touchType) => {
    if (touchType !== 'end') {
      const coord = this.calCoord(x, y)
      const coordAry = coord.split('-')
      this.tx = coordAry[0]
      this.ty = coordAry[1]

      console.log(this.tx, this.ty, coordAry[0], coordAry[1])

      if (this.tx > -1 && this.ty > -1 && (this.tx !== x || this.ty !== y)) {
        const ary = []
        // 2 1 3 2 
        // 3 2 5 5
        // 5 5 9 11
        // 9 11 13 16
        // 13 16 19 28
        // 19 28 27 44
        // 27 44 29 48
        // 29 48 33 51
        // 33 51 34 51
        // 34 51 36 51
        return ary
      }
      return [coordAry]
    } else {
      this.tx = -1
      this.ty = -1
      return []
    }
  }

  updateGrid = (x, y, color, touchType) => {    
    if (x && y) {
      const coords = this.getCoords(x, y, touchType)
      console.log('coords: ', coords)
      const coord = this.calCoord(x, y)
      let colorIndex = this.colors.indexOf(color || this.color)
      if (colorIndex === -1) {
        this.colors.push(color)
        colorIndex = this.colors.length - 1
      }
      this.data += `${coord}-${colorIndex} `
      const coordAry = coord.split('-')
      this.fillRect(coordAry[0] * this.interval, coordAry[1] * this.interval, this.interval, this.interval, this.colors[colorIndex])
      this.ctx.draw(true)
    }
  }

  createSharePicture = ({ avatar, qrcode, name, title, description, time}, { showGrid, color = '#ffffff', fontColor = '#333333' }) => {
    // 截取昵称 超出省略。。。
    if (name.length > 16) {   //用户昵称显示一行 截取
      name = name.slice(0, 9) + '...'
    };
    if (title.length > 16) {
      title = title.slice(0, 9) + '...'
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.fillRect(0, 0, this.canvas.width, this.canvas.height, color)
    if (showGrid) {
      this.strokeGrid('grey', this.interval)
      this.strokeGrid('grey', Math.floor(this.interval * 5))
    }
    this.draw()

    this.ctx.save()
    //绘制logo
    this.ctx.drawImage(avatar, 16, 16, 46, 44);
    this.ctx.restore();
    
    this.ctx.save();
    // 绘制标题
    this.ctx.font = 'normal normal 14px sans-serif';
    this.ctx.setTextAlign('left');
    this.ctx.setFillStyle(fontColor)
    const nameWidth = this.ctx.measureText(title).width;
    this.ctx.fillText(title, 75, 35, nameWidth + 5);

    this.ctx.restore();

    this.ctx.save();

    // 名称 + 时间
    this.ctx.setFontSize(12);
    this.ctx.setTextAlign('right');
    this.ctx.setFillStyle(fontColor)
    const metrics = this.ctx.measureText(name + ' ' + time).width;
    this.ctx.fillText(name + ' ' + time, metrics + 75, 55, metrics + 5);

    const bottomBox = this.canvas.height - 100

    this.ctx.restore();

    this.ctx.save();
    // 二维码描述  及图片
    this.ctx.setStrokeStyle(fontColor);
    this.ctx.strokeRect(16, bottomBox, this.canvas.width - 36, 80);
    this.ctx.setFillStyle(color);
    this.ctx.fillRect(16, bottomBox, this.canvas.width - 36, 80);
    this.ctx.setFillStyle(fontColor)
    this.ctx.setFontSize(12);
    const d1 = description.slice(0, 11)
    const d2 = description.slice(11, 20)
    const d1Width = this.ctx.measureText(d1).width;
    const d2Width = this.ctx.measureText(d2).width;
    
    this.ctx.fillText(d1, 40, bottomBox + 30, d1Width + 5);   // 描述截取换行
    this.ctx.fillText(d2, 40, bottomBox + 60, d2Width + 5);

    // 绘制二维码
    this.ctx.drawImage(qrcode, this.canvas.width - 80, bottomBox + 12, 44, 44);
    this.ctx.setFontSize(10);
    this.ctx.setFillStyle(fontColor)
    const logoWidth = this.ctx.measureText('像素画，扫码关注').width;
    this.ctx.fillText('像素画，扫码关注', this.canvas.width - logoWidth - 40, bottomBox + 70, logoWidth + 5);

    this.ctx.draw(true)
    console.log('绘制完成')
  }

  //文字换行处理
  // canvas 标题超出换行处理
  wordsWrap(ctx, name, nameWidth, maxWidth, startX, srartY, wordsHight) {
    let lineWidth = 0;
    let lastSubStrIndex = 0;
    for (let i = 0; i < name.length; i++) {
      lineWidth += ctx.measureText(name[i]).width;
      if (lineWidth > maxWidth) {
        ctx.fillText(name.substring(lastSubStrIndex, i), startX, srartY);
        srartY += wordsHight;
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == name.length - 1) {
        ctx.fillText(name.substring(lastSubStrIndex, i + 1), startX, srartY);
      }
    }
  }

  createColorCard = () => {}

  formatImageData = (imageData, interval) => {
    console.log('imageData: ', imageData, interval)
    const data = imageData.data
    let rgbaCount = data.length / 4
    console.log(rgbaCount, data)
    // for (let i = 0; i< rgbaCount; i++) {
    //   // 注意下面索引的计算方式
    //   imageData.data[i * 4 + 0] = 255
    //   imageData.data[i * 4 + 1] = 0
    //   imageData.data[i * 4 + 2] = 0
    //   imageData.data[i * 4 + 3] = 255
    // }
  }

  smartExtractPixel = (pictureData, wx) => {
    console.log('pictureData: ', pictureData)
    this.drawImage(
      pictureData.path,
      { x: 0, y: 0, width: pictureData.width, height: pictureData.height },
      { x: (this.canvas.width - pictureData.width) / 2, y: 0, width: pictureData.width * (this.canvas.height / pictureData.height), height: this.canvas.height },
    )

    console.log('smartpixel-draw-true')
    this.ctx.draw(truefalse, () => {
      wx.canvasGetImageData({
        canvasId: this.canvas.id,
        width: this.canvas.width,
        height: this.canvas.height,
        x: 0,
        y: 0,
        success: (res) => {
          console.log("res:",res)
          this.formatImageData(res)
        },
        fail: (res) => {
          console.log("faild",res)
        }
      })
    })

    // 将图片平铺到画布中
    // 读取图片像素值
    // 设置程相关数据

    // this.drawImage(colorCanvas, Rectangle.create(100, 100, colorCanvas.width, colorCanvas.height))
    // // 接上面的代码继续往下来替换颜色
    // // 使用createImageData方法，大小为size * size 个像素
    // // 每个像素又有4个分量[r, g, b, a]
    // const imgData: ImageData = context.createImageData(size, size)
    // // imgData有三个属性，其中data属性存储的是一个Uint8ClampedArray类型数组对象
    // // 该数组中存储方式为：[r, g, b, a, r, g, b, a, ...]
    // // 所以imgData.data.length = size * size * 4
    // // 上面也提到过，imgData.data.length 表示的是所有分量的个数
    // // 而为了方便寻址，希望使用像素个数进行遍历，因此要除以4（一个像素由r，g，b，a这4个分量组成）
    // const data = imgData.data
    // let rgbaCount: number = data.length / 4
    // console.log(rgbaCount, data)
    // for (let i = 0; i< rgbaCount; i++) {
    //   // 注意下面索引的计算方式
    //   imgData.data[i * 4 + 0] = 255
    //   imgData.data[i * 4 + 1] = 0
    //   imgData.data[i * 4 + 2] = 0
    //   imgData.data[i * 4 + 3] = 255
    // }

    // // 一定要调用putImageData方法来替换context中的像素数据
    // context.putImageData(imgData, size * rColum, size * rRow, 0, 0, size, size)
  }
}

export default TestApplication
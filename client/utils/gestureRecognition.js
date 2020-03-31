// 持拖动平移和双指缩放
// 小程序中的canvas性能有限，特别在交互的过程中不断触发重绘会引发严重卡顿

const gestures = {
  Single: 'Single',
  Double: 'Double',
  Move: 'Move',
}

// 当前点离原点的距离
function getLen(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

// 两点之间的距离平方
function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y
}

// 两点之间的距离
function dotLen(v1, v2) {
  if (v1 && v2) {
    let x = Math.pow(v1.x - v2.x, 2)
    let y = Math.pow(v1.y - v2.y, 2)
    return Math.sqrt(x + y)
  }
  return 0
}

// 两点与原点相连之间的夹角
function getAngle(v1, v2) {
  var mr = getLen(v1) * getLen(v2)
  if (mr === 0) return 0
  var r = dot(v1, v2) / mr
  if (r > 1) r = 1
  return Math.acos(r)
}

// ？？？ 交叉
function cross(v1, v2) {
  return v1.x * v2.y - v2.x * v1.y
}

// 两点之间的夹角
function getRotateAngle(v1, v2) {
  var angle = getAngle(v1, v2)
  if (cross(v1, v2) > 0) {
      angle *= -1
  }

  return angle * 180 / Math.PI
}

class GestureRecognition {
  constructor(opt) {
    this.isDouble = false
    
    this.distanceStart = 0
    this.distance = 0
    this.distanceDiff = 0

    this.preV = { x: null, y: null }
    this.pinchStartLen = null
    this.zoom = 1
    this.angle = 0
    
    this.x1 = this.x2 = this.y1 = this.y2 = null
  }

  touchStartEvent = (e) => {
    if (!e.touches) return
    // this.start(e)
    this.x1 = e.touches[0].x
    this.y1 = e.touches[0].y
    
    this.isDouble = false

    if (e.touches.length > 1) {
      //确定为双手指手势 
      this.isDouble = true

      this.preV = {
        x: e.touches[1].x - this.x1,
        y: e.touches[1].y - this.y1,
      }
      this.x2 = this.preV.x
      this.y2 = this.preV.y

      // 触摸开始的宽度
      this.pinchStartLen = getLen(this.preV) // 得到的值和下面的一致
      // 确定两手指之前的初始距离
      this.distanceStart = dotLen(e.touches[0], e.touches[1]) 

      return {
        type: gestures.Double,
        distance: this.distanceStart,
      }
    }

    return {
      type: gestures.Single,
      x: e.touches[0].x,
      y: e.touches[0].y,
    }
  }

  getNewScale = (v1, v2) => {
    const newDistance = dotLen(v1, v2) 
    if (!this.distanceStart) {
      this.distanceStart = newDistance
    }
    this.distanceDiff = newDistance  - this.distanceStart
    // console.log('distance: ', distance)
    if (Math.abs(distanceDiff) > 20) {
      this.distance = distanceDiff

      let scale = this.scale + 0.005 * this.distance

      if (scale > 3) {
        scale = 3
      } else if (this.scale < 0.4) {
        scale = 0.4
      }

      if (scale !== this.scale) {
        this.scale = scale
        return scale
      }
      return 0
    }
    return 0
  }

  getDoubleData = (v1, v2) => {
    let preV = this.preV
    const currentX = v1.x
    const currentY = v1.y
    const sCurrentX = v2.x
    const sCurrentY = v2.y
    const v = {
      x: sCurrentX - currentX,
      y: sCurrentY - currentY,
    }

    if (preV.x !== null) {
      if (this.pinchStartLen > 0) {
        this.zoom = getLen(v) / this.pinchStartLen
      }

      this.angle = getRotateAngle(v, preV)
    }
    preV = v

    if (this.x1 !== null && this.x2 !== null) {
      this.deltaX = (currentX - this.x1 + sCurrentX - this.x2) / 2
      this.deltaY = (currentY - this.y1 + sCurrentX - this.y2) / 2
    } else {
      this.deltaX = 0
      this.deltaY = 0
    }

    this.x2 = sCurrentX
    this.y2 = sCurrentY
  }

  touchMoveEvent = (e) => {
    if (!e.touches) return
    if (e.touches.length === 1) {
      return {
        type: gestures.Single,
      }
    }

    if (e.touches.length > 1) {
      this.isDouble = true
    }

    this.getDoubleData(e.touches[0], e.touches[1])
    const newScale = this.getNewScale(e.touches[0], e.touches[1])

    return {
      type: gestures.Double,
      zoom: this.zoom,
      scale: newScale,
      angle: this.angle,
      translateX: this.deltaX,
      translateY: this.deltaY,
    }
  }

  touchEndEvent = (e) => {
    if (!e.changedTouches) return
    // this.end(e)
    this.endX = e.changedTouches[0].x
    this.endY = e.changedTouches[0].y

    // 双手指处理方法
    if (this.isDouble) {
      this.isDouble = false
      this.pinchStartLen = 0
      this.distance = 0
      this.preV = { x: 0, y: 0 }
      this.zoom = 1
      this.distanceStart = null
      this.x1 = this.y1 = this.x2 = this.y2 = null
  
      return {
        type: gestures.Double
      }
    }

    return {
      type: gestures.Single
    }
  }
}

export default GestureRecognition
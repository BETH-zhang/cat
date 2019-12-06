// 持拖动平移和双指缩放
// 小程序中的canvas性能有限，特别在交互的过程中不断触发重绘会引发严重卡顿

const gestures = {
  Single: 'Single',
  Double: 'Double',
  Move: 'Move',
}

class GestureRecognition {
  constructor() {
    this.isDouble = false
    this.touch = {
      startX: 0,
      startY: 0,
      distanceStart: 0,
      distanceEnd: 0,
    }
  }

  touchStart = (e) => {
    console.log('start-e: ', e.touches, e)
    this.touch.startX = e.changedTouches[0].x;
    this.touch.startY = e.changedTouches[0].y;

    this.isDouble = false

    if (e.touches.length === 2) {
      //确定为双手指手势 
      this.isDouble = true

      let x = Math.pow(e.touches[0].x - e.touches[1].x, 2)
      let y = Math.pow(e.touches[0].y - e.touches[1].y, 2)
      this.touch.distanceStart = Math.sqrt(x + y)
      console.log('ss', this.touch.distance)

      return {
        type: gestures.Double,
        distance: this.touch.distanceStart,
      }
    }

    return {
      type: gestures.Single,
      x: e.touches[0].x,
      y: e.touches[0].y,
    }
  }

  touchMove = (e) => {
    console.log('1e: ', e.touches, e, this.isDouble, !this.isDouble && e.touches.length === 1)
    if (!this.isDouble && e.touches.length === 1) {
      console.log('111')
      return {
        type: gestures.Single,
        x: e.touches[0].x,
        y: e.touches[0].y,
      }
    }

    if (e.touches.length === 2) {
      this.isDouble = true
    }

    let x = Math.pow(e.touches[0].x - e.touches[1].x, 2)
    let y = Math.pow(e.touches[0].y - e.touches[1].y, 2)
    console.log('Math.sqrt(x+y)', Math.sqrt(x + y), x, y)
    if (!this.touch.distanceStart) {
      this.touch.distanceStart =  Math.sqrt(x + y)
    }
    let distance = Math.sqrt(x + y) - this.touch.distanceStart
    if (Math.abs(distance) > 20) {
      this.touch.distanceEnd = distance
    }

    return {
      type: gestures.Double,
      distance: this.touch.distanceEnd,
    }
  }

  touchEnd = (e) => {
    this.touch.endX = e.changedTouches[0].x;
    this.touch.endY = e.changedTouches[0].y;
    let x = this.touch.endX - this.touch.startX
    let y = this.touch.endY - this.touch.startY

    // 双手指处理方法
    if (this.isDouble) {
      this.isDouble = false

      console.log('this.touch.distanceEnd', this.touch.distanceEnd)
      if (this.touch.distanceEnd > 20) {
        console.log('this.touch.distanceEnd: ', this.touch.distanceEnd)
        // 放大
      } else if (this.touch.distanceEnd < -20) {
        console.log('this.touch.distanceEnd: ', this.touch.distanceEnd)
        // 缩小
      }
      this.touch.distanceStart = 0
      this.touch.distanceEnd = 0
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
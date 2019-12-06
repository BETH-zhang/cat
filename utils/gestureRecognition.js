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
    }
  }

  touchStart = (e) => {
    this.touch.startY = e.changedTouches[0].clientY;
    this.touch.startX = e.changedTouches[0].clientX;

    this.isDouble = false

    if (e.touches.length === 2) {
      //确定为双手指手势 
      this.isDouble = true

      let x = Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2)
      let y = Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      this.touch.distanceStart = Math.sqrt(x + y)
      console.log('ss', this.touch.distance)

      return {
        type: gestures.Double,
      }
    }

    return {
      type: gestures.Single,
      x: e.touches[0].x,
      y: e.touches[0].y,
    }
  }

  touchMove = (e) => {
    if (!this.isDouble) {
      return {
        type: gestures.Single,
        x: e.touches[0].x,
        y: e.touches[0].y,
      }
    }

    if (e.touches.length === 1 || this.touch.distanceEnd) {
      // 如果为单手指手势或已经确定this.touch.distanceEnd，则不再执行以下函数。
      return {}
    }

    let x = Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2)
    let y = Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
    console.log('Math.sqrt(x+y)', Math.sqrt(x + y))
    let distance = Math.sqrt(x + y) - this.touch.distanceStart
    if (Math.abs(distance) > 20) {
      this.touch.distanceEnd = distance
    }

    return {
      type: gestures.Double,
      distance: distance,
    }
  }

  touchEnd = (e) => {
    this.touch.endX = e.changedTouches[0].clientX;
    this.touch.endY = e.changedTouches[0].clientY;
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
      this.touch.distanceEnd = 0
      return
    }
  }
}

export default GestureRecognition
import { throttle } from './util.js'
// 持拖动平移和双指缩放
// 小程序中的canvas性能有限，特别在交互的过程中不断触发重绘会引发严重卡顿

const gestures = {
  Single: 'Single',
  Double: 'Double',
  Move: 'Move',
}

// 当前点离原点的距离
function getLen(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

// 两点之间的距离平方
function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
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
  var mr = getLen(v1) * getLen(v2);
  if (mr === 0) return 0;
  var r = dot(v1, v2) / mr;
  if (r > 1) r = 1;
  return Math.acos(r);
}

// ？？？ 交叉
function cross(v1, v2) {
  return v1.x * v2.y - v2.x * v1.y;
}

// 两点之间的夹角
function getRotateAngle(v1, v2) {
  var angle = getAngle(v1, v2);
  if (cross(v1, v2) > 0) {
      angle *= -1;
  }

  return angle * 180 / Math.PI;
}

class GestureRecognition {
  constructor(opt) {
    this.isDouble = false
    this.touch = {
      startX: 0,
      startY: 0,
      distanceStart: 0,
      distanceEnd: 0,
      scale: 1,
      translateX: 0,
      translateY: 0,
      zoom: 1,
    }

    var noop = function(type) {
      return function(data) {
        if (type === 'pinch') {
          console.log(type, '被触发', data)
        }
        // console.log(type, '被触发')
      }
    }
    var option = opt || {}

    this.preV = { x: null, y: null };
    this.pinchStartLen = null;
    this.zoom = 1;
    this.isDoubleTap = false;
    // 多指旋转
    this.rotate = option.rotate || noop('rotate')
    this.touchStart = option.touchStart || noop('touchStart')
    this.multipointStart = option.multipointStart || noop('multipointStart');
    this.multipointEnd = option.multipointEnd || noop('multipointEnd')
    // 双指缩放
    this.pinch = option.pinch || noop('pinch')
    // 单指滑动
    this.swipe = option.swipe || noop('swipe')
    // 单指单击
    this.tap = option.tap || noop('tap')
    // 单指双击
    this.doubleTap = option.doubleTap || noop('doubleTap')
    // 长按
    this.longTap = option.longTap || noop('longTap')
    this.singleTap = option.singleTap || noop('singleTap')
    // 单指移动
    this.pressMove = option.pressMove || noop('pressMove')
    this.twoFingerPressMove = option.twoFingerPressMove || noop('twoFingerPressMove')
    this.touchMove = option.touchMove || noop('touchMove')
    this.touchEnd = option.touchEnd || noop('touchEnd')
    this.touchCancel = option.touchCancel || noop('touchCancel')

    this.delta = null;
    this.last = null;
    this.now = null;
    this.tapTimeout = null;
    this.singleTapTimeout = null;
    this.longTapTimeout = null;
    this.swipeTimeout = null;
    this.x1 = this.x2 = this.y1 = this.y2 = null;
    this.preTapPosition = { x: null, y: null };

  }

  start = (evt) => {
    if (!evt.touches) return;
      this.now = Date.now();
      this.x1 = evt.touches[0].pageX;
      this.y1 = evt.touches[0].pageY;
      this.delta = this.now - (this.last || this.now);
      this.touchStart()
      if (this.preTapPosition.x !== null) {
          this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
          if (this.isDoubleTap) clearTimeout(this.singleTapTimeout);
      }
      this.preTapPosition.x = this.x1;
      this.preTapPosition.y = this.y1;
      this.last = this.now;
      var preV = this.preV,
          len = evt.touches.length;
      if (len > 1) {
          this._cancelLongTap();
          this._cancelSingleTap();
          var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
          preV.x = v.x;
          preV.y = v.y;
          this.pinchStartLen = getLen(preV);
          this.multipointStart()
      }
      this._preventTap = false;
      this.longTapTimeout = setTimeout(function () {
          this.longTap()
          this._preventTap = true;
      }.bind(this), 750);
  }

  move = (evt) => {
      if (!evt.touches) return;
      var preV = this.preV,
          len = evt.touches.length,
          currentX = evt.touches[0].pageX,
          currentY = evt.touches[0].pageY;
      this.isDoubleTap = false;
      if (len > 1) {
          var sCurrentX = evt.touches[1].pageX,
              sCurrentY = evt.touches[1].pageY
          var v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };

          if (preV.x !== null) {
              if (this.pinchStartLen > 0) {
                  evt.zoom = getLen(v) / this.pinchStartLen;
                  this.pinch(evt.zoom)
              }

              evt.angle = getRotateAngle(v, preV);
              this.rotate()
          }
          preV.x = v.x;
          preV.y = v.y;

          if (this.x2 !== null && this.sx2 !== null) {
              evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
              evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
          } else {
              evt.deltaX = 0;
              evt.deltaY = 0;
          }
          this.twoFingerPressMove()

          this.sx2 = sCurrentX;
          this.sy2 = sCurrentY;
      } else {
          if (this.x2 !== null) {
              evt.deltaX = currentX - this.x2;
              evt.deltaY = currentY - this.y2;

              //move事件中添加对当前触摸点到初始触摸点的判断，
              //如果曾经大于过某个距离(比如10),就认为是移动到某个地方又移回来，应该不再触发tap事件才对。
              var movedX = Math.abs(this.x1 - this.x2),
                  movedY = Math.abs(this.y1 - this.y2);

              if(movedX > 10 || movedY > 10){
                  this._preventTap = true;
              }

          } else {
              evt.deltaX = 0;
              evt.deltaY = 0;
          }
          
          
          this.pressMove()
      }

      this.touchMove()

      this._cancelLongTap();
      this.x2 = currentX;
      this.y2 = currentY;
      
      if (len > 1) {
          // evt.preventDefault();
      }
  }

  end = (evt) => {
      if (!evt.changedTouches) return;
      this._cancelLongTap();
      var self = this;
      if (evt.touches.length < 2) {
          this.multipointEnd()
          this.sx2 = this.sy2 = null;
      }

      //swipe
      if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
          (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
          evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
          this.swipeTimeout = setTimeout(function () {
              self.swipe()

          }, 0)
      } else {
          this.tapTimeout = setTimeout(function () {
              if(!self._preventTap){
                  self.tap()
              }
              // trigger double tap immediately
              if (self.isDoubleTap) {
                  self.doubleTap()
                  self.isDoubleTap = false;
              }
          }, 0)

          if (!self.isDoubleTap) {
              self.singleTapTimeout = setTimeout(function () {
                  self.singleTap()
              }, 250);
          }
      }

      this.touchEnd()

      this.preV.x = 0;
      this.preV.y = 0;
      this.zoom = 1;
      this.pinchStartLen = null;
      this.x1 = this.x2 = this.y1 = this.y2 = null;
  }

  cancelAll = () => {
      this._preventTap = true
      clearTimeout(this.singleTapTimeout);
      clearTimeout(this.tapTimeout);
      clearTimeout(this.longTapTimeout);
      clearTimeout(this.swipeTimeout);
  }

  cancel = (evt) => {
      this.cancelAll()
      this.touchCancel()
  }

  _cancelLongTap = () => {
      clearTimeout(this.longTapTimeout);
  }
  
  _cancelSingleTap = () => {
      clearTimeout(this.singleTapTimeout);
  }

  _swipeDirection = (x1, x2, y1, y2) => {
      return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  touchStartEvent = (e) => {
    // this.start(e)
    this.touch.startX = e.changedTouches[0].x;
    this.touch.startY = e.changedTouches[0].y;

    this.isDouble = false

    if (e.touches.length === 2) {
      //确定为双手指手势 
      this.isDouble = true

      this.touch.distanceStart = dotLen(e.touches[0], e.touches[1]) 

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

  getNewScale = (v1, v2) => {
    const distanceStart = dotLen(v1, v2) 
    if (!this.touch.distanceStart) {
      this.touch.distanceStart = distanceStart
    }
    let distance = distanceStart  - this.touch.distanceStart
    // console.log('distance: ', distance)
    if (Math.abs(distance) > 20) {
      this.touch.distanceEnd = distance

      let scale = this.touch.scale + 0.005 * this.touch.distanceEnd

      if (scale > 3) {
        scale = 3
      } else if (this.touch.scale < 0.4) {
        scale = 0.4
      }

      if (scale !== this.touch.scale) {
        this.touch.scale = scale
        return scale
      }
      return 0
    }
    return 0
  }

  getDoubleData = (v1, v2) => {
    var preV = this.preV,
        currentX = v1.x,
        currentY = v1.y;
    var sCurrentX = v2.x,
        sCurrentY = v2.y
    const v = { x: sCurrentX - currentX, y: sCurrentY - currentY };

    if (preV.x !== null) {
      if (!this.x1 || !this.x2) {
        const v0 = { x: v1.x - v2.x, y: v1.y - v2.y };
        preV.x = v0.x;
        preV.y = v0.y;
        this.pinchStartLen = getLen(preV);
      }
      if (this.pinchStartLen > 0) {
          this.touch.zoom = getLen(v) / this.pinchStartLen;
      }
    }
    preV.x = v.x;
    preV.y = v.y;

    if (this.x2 !== null && this.sx2 !== null) {
        this.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
        this.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
    } else {
        this.deltaX = 0;
        this.deltaY = 0;
    }

    this.sx2 = sCurrentX;
    this.sy2 = sCurrentY;

    console.log(this.touch.zoom, this.deltaX, this.deltaY)
  }

  touchMoveEvent = (e) => {
    // console.log('---')
    // this.move(e)
    if (e.touches.length === 1) {
      return {
        type: gestures.Single,
        x: e.touches[0].x,
        y: e.touches[0].y,
      }
    }

    if (e.touches.length > 1) {
      this.isDouble = true
    }

    const newScale = this.getNewScale(e.touches[0], e.touches[1])
    if (newScale) {
      return {
        type: gestures.Double,
        scale: newScale,
        translateX: this.touch.translateX,
        translateY: this.touch.translateY,
      }
    }
  }

  touchEndEvent = (e) => {
    // this.end(e)
    this.touch.endX = e.changedTouches[0].x;
    this.touch.endY = e.changedTouches[0].y;

    // 双手指处理方法
    if (this.isDouble) {
      this.isDouble = false
      // this.touch.distanceStart = 0
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
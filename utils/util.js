const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 判断对象是否为空
*/
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

const compareVersion = (v1, v2) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

const throttle = (method, delay, duration) => {
  const self = this;
  let timer = null;
  let begin = new Date()
  return (...rest) => {
    const context = self;
    const args = rest;
    const current = new Date()
    clearTimeout(timer)
    timer = null
    if (current - begin >= duration) {
      method.apply(context, args)
      begin = current;
    } else if (delay) {
      timer = setTimeout(() => {
        method.apply(context, args)
      }, delay)
    }
  }
}

const fetchApi = () => {
  // http://zhongguose.com/colors.json
  wx.request({
    url: 'http://zhongguose.com/colors.json', //这里填写你的接口路径
    header: { //这里写你借口返回的数据是什么类型，这里就体现了微信小程序的强大，直接给你解析数据，再也不用去寻找各种方法去解析json，xml等数据了
     'Content-Type': 'application/json'
    },
    data: {//这里写你要请求的参数
    },
    success: function(res) {
      //这里就是请求成功后，进行一些函数操作
      console.log(res.data)
    }
   })
}

const gridConnectionPoints = (p0, p1) => {
  const a = (p1[1] - p0[1]) / (p1[0] - p0[0])
  const b = p0[1] - a * p0[0]
  const dx = p1[0] - p0[0]
  const dy = p1[1] - p0[1]

  if (dx > 0 && dy > 0) {
    const step = Math.max(dx, dy)
    if (step > 2) {
      const points = Array(step).fill(0).map((item, index) => {
        if (dx >= dy) {
          const x = p0[0] + index
          const y = Math.round(a * x + b)
          return [x, y]
        } else {
          const y = p0[1] + index
          const x = Math.round((y - b) / a)
          return [x, y]
        }
      })
      return points
    }
    return [p1]
  } else if (dx > 0 && dy === 0) {
    const points = Array(dx).fill(0).map((item, index) => {
      return [p0[0] + index + 1, p0[1]]
    })
    return points
  } else if (dy > 0 && dx === 0) {
    const points = Array(dy).fill(0).map((item, index) => {
      return [p0[0], p0[1] + index + 1]
    })
    return points
  }
  return [p1]
}

const requestAnimationFrame = function (callback, lastTime) {
  var lastTime;
  if (typeof lastTime === 'undefined') {
    lastTime = 0
  }
  var currTime = new Date().getTime();
  var timeToCall = Math.max(0, 30 - (currTime - lastTime));
  lastTime = currTime + timeToCall;
  return setTimeout(function () {
    callback(lastTime);
  }, timeToCall);
};

const cancelAnimationFrame = function (id) {
  clearTimeout(id);
}

module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  compareVersion: compareVersion,
  throttle: throttle,
  gridConnectionPoints: gridConnectionPoints,
  requestAnimationFrame: requestAnimationFrame,
  cancelAnimationFrame: cancelAnimationFrame,
}

const startTop = 40;
const startLeft = 40;
const width = 654;
const height = 1040;
const defaultProportion = 1

export default class ColorCard {
  palette(data) {
    console.log('data: ', data)
    let imgWidth = data.imgInfo.width
    let imgHeight = data.imgInfo.height
    const proportion = imgWidth / imgHeight
    if (proportion > defaultProportion) {
      imgWidth = data.imgInfo.height * defaultProportion
    } else if (proportion < defaultProportion) {
      imgHeight = data.imgInfo.width / defaultProportion
    }
    // console.log(imgWidth, imgHeight, '??????')

    const colors = []
    const colorsReverse = []
    data.colors.forEach((item, index) => {
      if (index < 5) {
        colors.push(_color(index, item, 0))
        colors.push(_colorText(index, item, 0))
      }
    })
    if (data.colorsReverse) {
      data.colorsReverse.forEach((item, index) => {
        if (index < 5) {
          colorsReverse.push(_color(index, item, 1))
          colorsReverse.push(_colorText(index, item, 1))
        }
      })
    }

    return ({
      width: `${width}rpx`,
      height: `${height}rpx`,
      background: '#20243d',
      views: [
        {
          type: 'image',
          url: data.avatar,
          css: {
            top: `${startTop}rpx`,
            left: `${startLeft}rpx`,
            width: '64rpx',
            height: '64rpx',
            rotate: 0,
            borderRadius: '48rpx',
          },
        },
        {
          type: 'text',
          text: data.name,
          css: {
            top: `${startTop}rpx`,
            left: `${startLeft * 1.5 + 64}rpx`,
            fontSize: '24rpx',
            color: '#ccc',
          },
        },
        {
          type: 'text',
          text: data.time,
          css: {
            top: `${startTop + 40}rpx`,
            left: `${startLeft * 1.5 + 64}rpx`,
            fontSize: '16rpx',
            color: '#666',
          },
        },
        {
          type: 'image',
          url: data.qrcode,
          css: {
            top: `${startTop}rpx`,
            right: `${startLeft}rpx`,
            width: '64rpx',
            height: '64rpx',
            rotate: 0,
            borderRadius: '48rpx',
          },
        },
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: `${width / defaultProportion}rpx`,
            color: '#ccc',
            top: `${startTop * 2 + 64}rpx`,
            left: 0,
          },
        },
        {
          type: 'image',
          url: data.imgInfo.path,
          css: {
            top: `${startTop * 2 + 64}rpx`,
            left: 0,
            width: `${width}rpx`,
            height: `${width / defaultProportion}rpx`,
            mode: 'aspectFill',
          },
        },
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: `${width / defaultProportion}rpx`,
            color: '#20243d',
            top: `${startTop * 2 + 64 + width / defaultProportion}rpx`,
            left: 0,
          },
        },
        ...colors,
        {
          type: 'text',
          text: "程小元像素",
          css: {
            width: `${width}rpx`,
            left: `${width / 2}rpx`,
            bottom: `${startLeft}rpx`,
            fontWeight: 'bold',
            fontSize: '50rpx',
            color: '#2e2c42',
            align: 'center',
            textAlign: 'center',
          },
        },
        ...colorsReverse,
      ],
    });
  }
}

const colorTop = startTop * 2 + 64 + width / defaultProportion + startLeft
const colorGap = Math.floor((width - startLeft * 6) / 14)
const colorWidth = colorGap * 2

function _color(index, color, row) {
  return ({
    type: 'rect',
    css: {
      width: `${colorWidth}rpx`,
      height: `${colorWidth}rpx`,
      top: `${colorTop + row * (colorTop + colorGap * 3.5)}rpx`,
      left: `${startLeft * 3 + colorGap * 3 * index}rpx`,
      color,
      borderRadius: `${colorGap}rpx`,
      borderWidth: '5rpx',
      borderColor: '#ffffff',
    },
  })
}

function _colorText(index, color, row) {
  return ({
    type: 'text',
    text: color,
    css: {
      top: `${colorTop + colorGap * 2.5 + row * (colorTop + colorGap * 3.5)}rpx`,
      left: `${startLeft * 3 + colorGap * 3 * index + colorGap}rpx`,
      color: '#ffffff',
      width: `${colorGap * 3}rpx`,
      fontSize: '14rpx',
      align: 'center',
      textAlign: 'center',
    },
  })
}

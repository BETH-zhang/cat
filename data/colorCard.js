const startTop = 40;
const startLeft = 40;
const width = 654;
const height = 1040;
const defaultProportion = 16 / 9

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

    const colors = []
    data.colors.forEach((item, index) => {
      if (index < 5) {
        colors.push(_color(index, item))
        colors.push(_colorText(index, item))
      }
    })

    return ({
      width: `${width}rpx`,
      height: `${height}rpx`,
      background: '#ffffff',
      views: [
        {
          type: 'image',
          url: data.avatar,
          css: {
            top: `${startTop}rpx`,
            left: `${startLeft}rpx`,
            width: '96rpx',
            height: '96rpx',
            rotate: 0,
            borderRadius: '48rpx',
          },
        },
        {
          type: 'text',
          text: data.name,
          css: {
            top: `${startTop}rpx`,
            left: `${startLeft * 1.5 + 96}rpx`,
            fontSize: '36rpx'
          },
        },
        {
          type: 'text',
          text: data.time,
          css: {
            top: `${startTop + 55}rpx`,
            left: `${startLeft * 1.5 + 96}rpx`,
            fontSize: '28rpx',
            color: '#666',
          },
        },
        {
          type: 'image',
          url: data.qrcode,
          css: {
            top: `${startTop}rpx`,
            right: `${startLeft}rpx`,
            width: '96rpx',
            height: '96rpx',
            rotate: 0,
            borderRadius: '24rpx',
          },
        },
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: `${width * 3 / 4}rpx`,
            color: '#ccc',
            top: `${startTop * 2 + 96}rpx`,
            left: 0,
          },
        },
        {
          type: 'image',
          url: data.imgInfo.path,
          css: {
            width: `${imgWidth}rpx`,
            height: `${imgHeight}rpx`,
            top: `${startTop * 2 + 96}rpx`,
            left: 0,
          },
        },
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: `${width * 3 / 4}rpx`,
            color: '#20243d',
            top: `${startTop * 2 + 96 + width * 3 / 4}rpx`,
            left: 0,
          },
        },
        ...colors,
        // _color(0, 'red'),
        // _color(1, 'red'),
        // _color(2, 'red'),
        // _color(3, 'red'),
        // _color(4, 'red'),
        // _colorText(0, 'red'),
        // _colorText(1, 'red'),
        // _colorText(2, 'red'),
        // _colorText(3, 'red'),
        // _colorText(4, 'red'),
        {
          type: 'text',
          text: "程小元像素",
          css: {
            width: `${width}rpx`,
            left: `${width / 2}rpx`,
            bottom: `${startLeft * 2}rpx`,
            fontWeight: 'bold',
            fontSize: '100rpx',
            color: '#2e2c42',
            align: 'center',
            textAlign: 'center',
          },
        },
      ],
    });
  }
}

const colorTop = startTop * 2 + 96 + width * 3 / 4 + startLeft
const colorGap = Math.floor((width - startLeft * 2) / 14)
const colorWidth = colorGap * 2

function _color(index, color) {
  return ({
    type: 'rect',
    css: {
      width: `${colorWidth}rpx`,
      height: `${colorWidth}rpx`,
      top: `${colorTop}rpx`,
      left: `${startLeft + colorGap * 3 * index}rpx`,
      color,
      borderRadius: `${colorGap}rpx`,
      borderWidth: '5rpx',
      borderColor: '#ffffff',
    },
  })
}

function _colorText(index, color) {
  return ({
    type: 'text',
    text: color,
    css: {
      top: `${colorTop + colorGap * 2.5}rpx`,
      left: `${startLeft + colorGap * 3 * index + colorGap}rpx`,
      color: '#ffffff',
      width: `${colorGap * 3}rpx`,
      // fontSize: '12rpx',
      align: 'center',
      textAlign: 'center',
    },
  })
}

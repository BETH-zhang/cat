/*
 * @Author: beth
 * @Date: 2020-07-14 10:05:26
 * @LastEditors: beth
 * @LastEditTime: 2020-07-15 12:11:24
 * @Description: 
 */ 
const startTop = 40;
const startLeft = 40;
let width = 1000;
const headerHeight = 208
let height = headerHeight;

let colorGap = Math.floor((width - startLeft * 8) / 14)
let colorWidth = colorGap * 2
export default class ColorCard {
  palette(data) {
    const workShows = []

    data.imgInfo.forEach((item) => {
      workShows.push({
        type: 'image',
        url: item.path,
        css: {
          top: `${height}rpx`,
          left: 0,
          width: `${width}rpx`,
          height: `${item.height}rpx`,
          mode: 'aspectFill',
        },
      })

      height += width * (item.height / item.width)

      item.colors.forEach((item, index) => {
        if (index < 5) {
          workShows.push(_color(index, item, height))
        }
      })

      height += colorWidth * 1.5
    })

    height += 50

    return ({
      width: `${width}rpx`,
      height: `${height}rpx`,
      background: '#fff',
      views: [
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: `${headerHeight}rpx`,
            color: '#fff',
            top: 0,
            left: 0,
          },
        },
        {
          type: 'image',
          url: data.logoText,
          css: {
            top: `${headerHeight / 3.3}rpx`,
            left: `${width / 2 / 8}rpx`,
            width: `${width / 3.5}rpx`,
            height: `${headerHeight / 2.8}rpx`,
            mode: 'aspectFill',
          },
        },
        {
          type: 'image',
          url: data.avatar,
          css: {
            top: `${headerHeight / 4}rpx`,
            left: `${width / 2 + width / 3 / 7}rpx`,
            width: `${headerHeight / 2}rpx`,
            height: `${headerHeight / 2}rpx`,
            rotate: 0,
            borderRadius: '48rpx',
          },
        },
        {
          type: 'text',
          text: data.name,
          css: {
            top: `${headerHeight / 3 - 15}rpx`,
            left: `${width / 2 + width / 7 - width / 2 / 7 + headerHeight / 2}rpx`,
            width: `${headerHeight / 2 * 3}rpx`,
            height: `${headerHeight / 2}rpx`,
            fontSize: '24rpx',
            color: '#000',
          },
        },
        {
          type: 'text',
          text: data.title,
          css: {
            top: `${headerHeight / 3 + 20}rpx`,
            left: `${width / 2 + width / 7 - width / 2 / 7 + headerHeight / 2}rpx`,
            width: `${headerHeight / 2 * 3}rpx`,
            height: `${headerHeight / 2}rpx`,
            fontSize: '24rpx',
            color: '#666',
          },
        },
        {
          type: 'text',
          text: data.subTitle,
          css: {
            top: `${headerHeight / 3 + 50}rpx`,
            left: `${width / 2 + width / 7 - width / 2 / 7 + headerHeight / 2}rpx`,
            width: `${headerHeight / 2 * 3}rpx`,
            height: `${headerHeight / 2}rpx`,
            fontSize: '24rpx',
            color: '#666',
          },
        },
        {
          type: 'text',
          text: data.time,
          css: {
            top: `${headerHeight / 3 + 80}rpx`,
            left: `${width / 2 + width / 7 - width / 2 / 7 + headerHeight / 2}rpx`,
            width: `${headerHeight / 2 * 3}rpx`,
            height: `${headerHeight / 2}rpx`,
            fontSize: '24rpx',
            color: '#666',
          },
        },
        ...workShows,
        {
          type: 'text',
          text: data.description,
          css: {
            width: `${width}rpx`,
            left: `${width / 2}rpx`,
            bottom: `${startLeft}rpx`,
            fontWeight: 'bold',
            fontSize: '30rpx',
            color: '#2e2c42',
            align: 'center',
            textAlign: 'center',
          },
        },
      ],
    });
  }
}

function _color(index, color, top) {
  return ({
    type: 'rect',
    css: {
      width: `${colorWidth}rpx`,
      height: `${colorWidth}rpx`,
      top: `${top - colorGap}rpx`,
      left: `${startLeft * 3 + colorGap * 3.5 * index}rpx`,
      color,
      borderRadius: `${colorGap}rpx`,
      borderWidth: '5rpx',
      borderColor: '#ffffff',
    },
  })
}

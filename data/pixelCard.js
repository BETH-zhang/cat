const startTop = 40;
const startLeft = 40;
const width = 654;
let height = 1040;
const defaultProportion = 4 / 3
const footerHeight = startTop * 2 + 96

export default class PixelCard {
  palette(data) {
    console.log('data: ', data)
    const proportion = data.imgInfo.width / data.imgInfo.height
    const imgHeight = width / proportion
    height = imgHeight + footerHeight

    return ({
      width: `${width}rpx`,
      height: `${height}rpx`,
      background: '#ffffff',
      views: [
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: `${imgHeight}rpx`,
            color: '#ccc',
            top: '0rpx',
            left: 0,
          },
        },
        {
          type: 'image',
          url: data.imgInfo.tempFilePath,
          css: {
            width: `${width}rpx`,
            height: `${imgHeight}rpx`,
            top: '0rpx',
            left: 0,
          },
        },
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
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: `${footerHeight}rpx`,
            color: '#ffffff',
            bottom: '0rpx',
            left: 0,
          },
        },
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: '1rpx',
            color: '#ccc',
            bottom: `${footerHeight}rpx`,
            left: 0,
          },
        },
        {
          type: 'image',
          url: data.avatar,
          css: {
            bottom: `${startTop}rpx`,
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
            bottom: `${startTop + 55}rpx`,
            left: `${startLeft * 1.5 + 96}rpx`,
            fontSize: '36rpx',
            color: '#000',
          },
        },
        {
          type: 'text',
          text: data.time,
          css: {
            bottom: `${startTop + 12}rpx`,
            left: `${startLeft * 1.5 + 96}rpx`,
            fontSize: '28rpx',
            color: '#666',
          },
        },
        {
          type: 'image',
          url: data.qrcode,
          css: {
            bottom: `${startTop - 12}rpx`,
            right: `${startLeft}rpx`,
            width: '120rpx',
            height: '120rpx',
            rotate: 0,
            borderRadius: '25rpx',
          },
        },
      ],
    });
  }
}

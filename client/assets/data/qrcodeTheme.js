const startTop = 40;
const startLeft = 40;
const width = 654;
const height = 1040;

export default class ColorCard {
  palette(data) {
    console.log('data: ', data)
    return ({
      width: `${width}rpx`,
      height: `${height}rpx`,
      background: '#20243d',
      views: [
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: `${height / 5}rpx`,
            color: '#fff',
            top: 0,
            left: 0,
          },
        },
        {
          type: 'rect',
          css: {
            width: '2rpx',
            height: `${height / 5 / 3}rpx`,
            color: '#333',
            top: `${height / 5 / 3}rpx`,
            left: `${width / 2 - 1}rpx`,
          },
        },
        {
          type: 'rect',
          css: {
            width: `${width}rpx`,
            height: `${height / 5 * 4}rpx`,
            color: '#f2f2f2',
            top: `${height / 5}rpx`,
            left: 0,
          },
        },
        {
          type: 'rect',
          css: {
            top: `${height / 5 / 3}rpx`,
            left: `${width / 2 / 4}rpx`,
            width: `${width / 3}rpx`,
            height: `${height / 5 / 3}rpx`,
            color: '#000',
          },
        },
        {
          type: 'image',
          url: data.avatar,
          css: {
            top: `${height / 5 / 3}rpx`,
            left: `${width / 2 / 4}rpx`,
            width: `${width / 3}rpx`,
            height: `${height / 5 / 3}rpx`,
          },
        },
        {
          type: 'rect',
          css: {
            top: `${height / 5 / 4}rpx`,
            left: `${width / 2 + width / 3 / 7}rpx`,
            width: `${height / 5 / 2}rpx`,
            height: `${height / 5 / 2}rpx`,
            color: '#000',
          },
        },
        {
          type: 'image',
          url: data.avatar,
          css: {
            top: `${height / 5 / 4}rpx`,
            left: `${width / 2 + width / 3 / 7}rpx`,
            width: `${height / 5 / 2}rpx`,
            height: `${height / 5 / 2}rpx`,
            rotate: 0,
            borderRadius: '48rpx',
          },
        },
        {
          type: 'rect',
          css: {
            top: `${height / 5 / 4}rpx`,
            left: `${width / 2 + width / 7 - width / 2 / 7 + height / 5 / 2}rpx`,
            width: `${height / 5 / 2 * 3}rpx`,
            height: `${height / 5 / 2}rpx`,
            color: '#ccc',
          },
        },
        {
          type: 'text',
          text: '程小元像素',
          css: {
            top: `${height / 5 / 3}rpx`,
            left: `${width / 2 + width / 7 - width / 2 / 7 + height / 5 / 2}rpx`,
            width: `${height / 5 / 2 * 3}rpx`,
            height: `${height / 5 / 2}rpx`,
            fontSize: '30rpx',
            fontWeight: 'bold',
            color: '#000',
          },
        },
        {
          type: 'text',
          text: 'chengxiaoyuan',
          css: {
            top: `${height / 5 / 3 + 45}rpx`,
            left: `${width / 2 + width / 7 - width / 2 / 7 + height / 5 / 2}rpx`,
            width: `${height / 5 / 2 * 3}rpx`,
            height: `${height / 5 / 2}rpx`,
            fontSize: '24rpx',
            color: '#666',
          },
        },
        {
          type: 'rect',
          css: {
            top: `${height / 5 / 3 * 4}rpx`,
            left: `${width / 6 }rpx`,
            width: `${width / 6 * 4}rpx`,
            height: `${height / 5 / 3 / 2 * 3 - 20}rpx`,
            color: '#000',
            rotate: 0,
            borderRadius: `${height / 5 / 3 / 2 * 3}rpx`,
          },
        },
        {
          type: 'rect',
          css: {
            top: `${height / 5 / 3 * 4 + 1}rpx`,
            left: `${width / 6 + 1}rpx`,
            width: `${width / 6 * 4 - 2}rpx`,
            height: `${height / 5 / 3 / 2 * 3 - 20 - 2}rpx`,
            color: '#f2f2f2',
            rotate: 0,
            borderRadius: `${height / 5 / 3 / 2 * 3}rpx`,
          },
        },
        {
          type: 'text',
          text: "请 长 按 下 方 二 维 码",
          css: {
            width: `${width}rpx`,
            left: `${width / 2}rpx`,
            top: `${height / 5 / 3 * 4 + 1 + 20}rpx`,
            fontSize: '30rpx',
            color: '#2e2c42',
            align: 'center',
            textAlign: 'center',
          },
        },
        {
          type: 'rect',
          css: {
            top: `${height / 5 * 2}rpx`,
            left: `${(width - 220) / 2}rpx`,
            width: `220rpx`,
            height: `220rpx`,
            color: '#fff',
          },
        },
        {
          type: 'rect',
          css: {
            top: `${height / 5 * 2 + 250}rpx`,
            left: `${(width - 220) / 2}rpx`,
            width: `220rpx`,
            height: `220rpx`,
            color: '#fff',
          },
        },
        {
          type: 'text',
          text: "添加微信时请说明来意",
          css: {
            width: `${width}rpx`,
            left: `${width / 2}rpx`,
            bottom: `70rpx`,
            fontSize: '26rpx',
            color: '#ccc',
            align: 'center',
            textAlign: 'center',
          },
        },
      ],
    });
  }
}

import Template1 from '../../data/card';
import Template2 from '../../data/image-example'
import Template3 from '../../data/shadow-example'
import Template4 from '../../data/text-example'
import ColorCard from '../../data/colorCard'
import PixelCard from '../../data/pixelCard'
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    template: {},
    image: '',
  },
  lifetimes: {
    created() {
      console.log("created")
    },
    attached() {
      console.log("attached")
    },
    ready() {
      console.log('flag')
      this.createTemplate('6')
    },
    moved() {
      console.log('moved')
    },
    detached() {
      console.log('detached')
    },
  },
  methods: {
    onImgOK(e) {
      this.setData({
        image: e.detail.path
      })
      console.log(e);
    },
  
    saveImage() {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.image,
      });
    },

    createTemplate(e) {
      const userInfo = wx.getStorageSync('userInfo') || {}
      switch(typeof e === 'string' ? e : e.target.dataset.cur) {
        case '1':
          this.setData({
            template: new Template1().palette(),
          });
          break;
        case '2':
          this.setData({
            template: new Template2().palette(),
          });
          break;
        case '3':
          this.setData({
            template: new Template3().palette(),
          });
          break;
        case '4':
          this.setData({
            template: new Template4().palette(),
          });
          break;
        case '5':
          const data = {
            avatar: userInfo.avatarUrl,
            qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            name: userInfo.nickName,
            title: '色卡分享',
            time: '2020.1.1',
            imgInfo: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            colors: ['red', 'red', 'red', 'red', 'red']
          }
          this.setData({
            template: new ColorCard().palette(data),
          })
          break;
        case '6':
          const data1 = {
            avatar: userInfo.avatarUrl,
            qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
            name: userInfo.nickName,
            title: '色卡分享',
            time: '2020.1.1',
            data: [],
            colors: [],
          }
          this.setData({
            template: new PixelCard().palette(data1),
          });
        default:
          break;
      }
    },
  }
})
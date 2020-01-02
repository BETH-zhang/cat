import Template1 from './data/card';
import Template2 from './data/image-example'
import Template3 from './data/shadow-example'
import Template4 from './data/text-example'
import Template5 from './data/example'
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
      const userInfo = wx.getStorageSync("userInfo") || app.globalData.userInfo || {}
      this.setData({
        template: new Template5().palette(userInfo),
      });
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
      const userInfo = wx.getStorageSync("userInfo") || app.globalData.userInfo || {}
      switch(e.target.dataset.cur) {
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
          this.setData({
            template: new Template5().palette(userInfo),
          })
          break;
        default:
          break;
      }
    },
  }
})
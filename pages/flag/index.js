import Card from './data/card';
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
      this.setData({
        template: new Card().palette(),
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
  }
})
import { downloadFile } from '../../../api/index'

const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    role: { type: 'String', value: '' },
  },
  data: {
    works: [],
    loadModal: false,
  },
  attached() {
    console.log('role', this.data.role)
    if (this.data.role === 'master') {
      this.initMasterData()
    } else {
      this.initData()
    }
  },
  methods: {
    pageBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    initMasterData() {
      this.setData({ loadModal: true })

      downloadFile('/json/11.json', 'json')
        .then((works) => {
          const urls = works.map((item) => item && item.path)
          this.setData({
            works,
            urls,
            loadModal: false,
          })
        })
    },
    initData() {
      var works = wx.getStorageSync('myWork') || []
      const urls = works.map((item) => item && item.path)
      this.setData({
        works,
        urls,
      })
    },
    viewImages(e) {
      wx.previewImage({
        urls: this.data.urls,
        current: e.currentTarget.dataset.url,
      })
    }
  }
})

// Page({
//   properties: {
//     role: { type: 'String', value: '' },
//   },
//   data: {
//     works: [],
//   },
//   onLoad: function () {
//     console.log('role', this.data.role)
//     this.initData()
//   },
//   pageBack() {
//     wx.navigateBack({
//       delta: 1
//     });
//   },
//   initData() {
//     var works = wx.getStorageSync('myWork') || []
//     const urls = works.map((item) => item && item.path)
//     this.setData({
//       works,
//       urls,
//     })
//   },
//   viewImages(e) {
//     wx.previewImage({
//       urls: this.data.urls,
//       current: e.currentTarget.dataset.cur,
//     })
//   }
// });

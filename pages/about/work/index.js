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
      console.log('initMasterData: ')
      wx.request({
        url: 'https://static.uskid.com/courseware/k3kfd8nt_y75zvuMAYomVetvAnX5CrVxA.json', //这里填写你的接口路径
        header: { //这里写你借口返回的数据是什么类型，这里就体现了微信小程序的强大，直接给你解析数据，再也不用去寻找各种方法去解析json，xml等数据了
         'Content-Type': 'application/json'
        },
        data: {//这里写你要请求的参数
        },
        success: (res) => {
          //这里就是请求成功后，进行一些函数操作
          // console.log('res.data: ', res.data)
          const works = res.data
          const urls = works.map((item) => item && item.path)
          this.setData({
            works,
            urls,
          })
        }
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

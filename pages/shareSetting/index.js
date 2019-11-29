const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    toolType: {
      type: "String",
      value: "",
      observer:function(news, olds, path){
        console.log('properties: ', news, olds, path)
      }
    },
    showGrid: { type: 'Boolean', value: false },
    title: { type: 'String', value: '程小元像素画' },
    description: { type: 'String', value: '' },
    shareImg: { type: 'String', value: '' },
  },
  data: {
    isSave: true,
  },
  attached() {
    console.log("sharesetting", this.data, this)
  },
  methods: {
    updateProps(e) {
      if (this.data.isSave) {
        const data = wx.getStorageSync('myWork') || []
        data.push({
          path: this.data.shareImg,
          title: this.data.title,
          description: this.data.description,
        })
        wx.setStorage({ key: 'myWork', data })
      }
      var myEventDetail = {
        title: this.data.title,
        description: this.data.description,
        showGrid: this.data.showGrid,
      }
      var myEventOption = {}
      this.triggerEvent('sharesettingevent', myEventDetail, myEventOption)
    },

    titleInputChange(e) {
      this.setData({
        title: e.detail.value,
      })
    },
    desInputChange(e) {
      this.setData({
        description: e.detail.value
      })
    },
    gridSelectChange(e) {
      this.setData({
        showGrid: e.detail.value
      })
    },
    isSaveChange(e) {
      this.setData({
        isSave: e.detail.value
      })
    },
  }
})
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    role: { type: 'String', value: '' },
  },
  data: {
    title: '程小元像素画',
    description: '',
    showGrid: false,
    isSave: false,
  },
  attached() {
    this.initData()
  },
  methods: {
    initData() {
      const settingData = wx.getStorageSync('setting') || {}
      this.setData(settingData)
    },
    save() {
      console.log(this.data)
      wx.setStorage({
        key: 'setting',
        data: this.data,
      })
      wx.navigateTo({ url: '/pages/index/index' })
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

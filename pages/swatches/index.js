const app = getApp();
var colorList = wx.getStorageSync('colors') || []
let data = []
if (colorList.length) {
  colorList.forEach((item) => {
    data = data.concat(item.colors)
  })
}

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    pixelColor: { type: 'String', value: '' },
  },
  data: {
    colorList: app.globalData.ColorList,
    type: 'pixel',

    pixelColor: 'rgba(240,113, 43, 1)',
    bgColor:  'rgba(255, 255, 255, 1)',
    fontColor: 'rgba(50, 50, 50, 1)'
  },
  attached() {
    console.log("colorsetting", this.data)
    this.setData({ colorList: this.data.colorList.concat(data) })
  },
  methods: {
    updateProps() {
      var myEventDetail = {
        pixelColor: this.data.pixelColor,
        bgColor:  this.data.bgColor,
        fontColor: this.data.fontColor,
      }
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('colorsettingevent', myEventDetail, myEventOption)
    },
    selectType(e) {
      this.setData({ type: e.currentTarget.dataset.cur })
    },
    selectColor(e) {
      switch(this.data.type) {
        case 'pixel':
          this.setData({ pixelColor: e.currentTarget.dataset.cur })
          break
        case 'bg':
          this.setData({ bgColor: e.currentTarget.dataset.cur })
          break
        case 'font':
          this.setData({ fontColor: e.currentTarget.dataset.cur })
          break
      }
      this.updateProps()
    },
  }
})
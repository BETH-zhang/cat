const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    setting: {
      type: "String",
      value: "",
      observer:function(news, olds, path){
        console.log('properties: ', news, olds, path)
      }
    },
    pixelColor: { type: 'String', value: '' },
    bgColor: { type: 'String', value: '' },
    fontColor: { type: 'String', value: '' },
  },
  data: {
    colorList: app.globalData.ColorList,
    type: 'pixel',

    rgba: {
      r: 240,
      g: 113,
      b: 43,
      a: 1
    },
    pixelColor: 'rgba(240,113, 43, 1)',
    bgColor:  'rgba(255, 255, 255, 1)',
    fontColor: 'rgba(50, 50, 50, 1)'
  },
  attached() {
    console.log("colorsetting", this.data)
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
      console.log('this.data.type: ', this.data.type, e.currentTarget.dataset.cur)
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
    getRgba(value) {
      const arys = value.replace('rgba(', '').replace(')', '').split(',')
      const rgba = {
        r: arys[0],
        g: arys[1],
        b: arys[2],
        a: arys[3],
      }
      return rgba
    },
    openPixelColorPanel() {
      const rgba = this.getRgba(this.data.pixelColor)
      this.setData({
        rgba,
        showColorPanel: 'pixelColor',
      })
    },
    openBgColorPanel() {
      const rgba = this.getRgba(this.data.bgColor)
      this.setData({
        rgba,
        showColorPanel: 'bgColor',
      })
    },
    openTextColorPanel() {
      const rgba = this.getRgba(this.data.fontColor)
      this.setData({
        rgba,
        showColorPanel: 'fontColor',
      })
    },
    sliderRedChange(e) {
      this.updateRgba('r', e.detail.value)
    },
    sliderGreenChange(e) {
      this.updateRgba('g', e.detail.value)
    },
    sliderBlueChange(e) {
      this.updateRgba('b', e.detail.value)
    },
    sliderOpcityChange(e) {
      this.updateRgba('a', e.detail.value.toFixed(2))
    },
    updateRgba(type, value) {
      const rgba = {
        ...this.data.rgba,
        [type]: value
      }
      this.setData({ rgba })
    },
  }
})
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
    }
  },
  data: {
  },
  attached() {
    console.log("colorsetting")
  },
  methods: {
    updateProps(e) {
      var myEventDetail = {
        color: e.currentTarget.dataset.cur,
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('colorsettingevent', myEventDetail, myEventOption)
    },
    selectColor() {
      const color = `rgba(${this.data.rgba.r}, ${this.data.rgba.g}, ${this.data.rgba.b}, ${this.data.rgba.a})`
      if (this.data.showColorPanel === 'bgColor') {
        this.appCanvas.init(color)
      }
      this.setData({
        setting: '',
      })
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
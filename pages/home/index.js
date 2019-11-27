const app = getApp();
import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    PageCur: {
      type: "String",
      value: "home",
      observer:function(news, olds, path){
        console.log('properties: ', news, olds, path)
      }
    }
  },
  data: {
    hideCanvas: false,
    currentType: 'setting',
    toolType: 'brush', // back, clearn, brush, eraser, straw, generate
    allowDraw: false,

    authSetting: 'login',

    shareImg: '',
    rgba: {
      r: 240,
      g: 113,
      b: 43,
      a: 1
    },
    pixelColor: 'rgba(240,113, 43, 1)',
    gap: 25,
    gapItems: [],
    bgColor:  'rgba(255, 255, 255, 1)',
    fontColor: 'rgba(50, 50, 50, 1)'
  },
  lifetimes: {
    created() {
      console.log("created")
    },
    attached() {
      console.log("attached")
    },
    ready() {
      this.initCanvas()
      this.selectColor(`rgba(${this.data.rgba.r}, ${this.data.rgba.g}, ${this.data.rgba.b}, ${this.data.rgba.a})`)
    },
    moved() {
      console.log('moved')
    },
    detached() {
      console.log('detached')
    },
  },
  methods: {
    SettingEventListener(e) {
      console.log(e.detail, '..SettingEventListener...')
      this.setData(e.detail)
    },
    ToolChange(e) {
      const key = e.currentTarget.dataset.cur
      // back, clean, brush, eraser, straw, generate
      switch(key) {
        case 'back':
          break
        case 'clean':
          this.appCanvas.clear()
          break
        case 'brush':
          this.setData({ toolType: 'brush' })
          break
        case 'eraser':
          this.setData({ toolType: 'eraser' })
          break
        case 'generate':
          this.setData({ toolType: 'generate' })
          break
      }

      this.setData({
        hideCanvas: key === 'generate',
      })
    },
    setCurrentType(e) {
      this.setData({
        currentType: e.currentTarget.dataset.cur,
      })
    },
    NavChange(e) {
      var myEventDetail = {
        PageCur: e.currentTarget.dataset.cur,
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },


    setGapItemsDefault() {
      const width = app.globalData.systemInfo.windowWidth
      const gapCounts = [5, 10, 15, 20, 25, 40]
      const gapItems = gapCounts.map((gapCount) => {
        const gap = Math.floor(width / gapCount)
        return { name: `${gapCount} 列网格`, value: gap }
      })
      gapItems.push({ name: '默认网格', value: 25 })
      this.setData({
        gapItems,
      })
    },
    radioChange(e) {
      const gap = Number(e.detail.value)
      this.bgCanvas.setGap(gap)
      this.bgCanvas.init(this.data.bgColor)
      this.appCanvas.setGap(gap)
      this.appCanvas.updateGrid(0, 0, '', true)
      this.setData({
        gap,
        showGridPanel: false,
      })
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
    tempCanvas() {
      this.wxUtils.canvasToTempFilePath('mainCanvas').then((shareImg) => {
        this.setData({
          shareImg: shareImg,
          currentType: 'setting',
        })
      })
    },
    dispatchTouchStart(e) {
      if (!this.data.allowDraw) {
        this.setData({
          allowDraw: true,
          x0: e.touches[0].x,
          y0: e.touches[0].y
        })
        this.appCanvas.updateGrid(e.touches[0].x, e.touches[0].y, this.data.pixelColor)
      }
    },
    dispatchTouchMove(e) {
      if (!this.data.allowDraw) {
        this.setData({
          x: e.touches[0].x,
          y: e.touches[0].y
        })
        this.appCanvas.updateGrid(e.touches[0].x, e.touches[0].y, this.data.pixelColor)
      }
    },
    dispatchTouchEnd(e) {
      if (!this.data.allowDraw) {
        this.setData({
          allowDraw: false,
        })
        this.appCanvas.updateGrid(this.data.x, this.data.y, this.data.pixelColor)
      }
    },
    initCanvas() {
      const width = app.globalData.systemInfo.windowWidth
      const height = Math.floor((app.globalData.systemInfo.windowHeight - 50) / this.data.gap) * this.data.gap
      this.setData({ width, height })
      const ctx = wx.createCanvasContext('mainCanvas', this)      
      this.appCanvas = new TestApplication(ctx, { width, height })
      this.appCanvas.setGap(this.data.gap)
      this.appCanvas.init(this.data.bgColor)
    },
    
    setShareTitle() {
      this.setData({
        showTitlePanel: true,
      })
    },
    inputTitle() {
      this.setData({
        showTitlePanel: false,
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
    selectColor() {
      const color = `rgba(${this.data.rgba.r}, ${this.data.rgba.g}, ${this.data.rgba.b}, ${this.data.rgba.a})`
      if (this.data.showColorPanel === 'bgColor') {
        // this.bgCanvas.init(color)
        this.appCanvas.init(color)
        this.appCanvas.draw()
      }
      this.setData({
        [this.data.showColorPanel]: color,
        showColorPanel: false,
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
    setGridGap() {
      this.setData({
        showGridPanel: true,
      })
    },

    savePicture() {
      if (!app.globalData.userInfo) {
        this.setData({
          authSetting: 'login'
        })
      } else {
        this.setData({
          loading: true
        })
        wx.showLoading({
          title: '图片生成中',
        })
        this.optPictureData()
      }
    },
  
    hideModal() {
      const shareCtx = wx.createCanvasContext('shareFrends', this);
      shareCtx.draw()
      this.setData({
        showModal: false,
        showShareModal: false,
      })
    },
    
    optPictureData() {
      console.log('读取图片')
      let that = this;
  
      const shareFrendsCtx = wx.createCanvasContext('shareFrends', this);    //绘图上下文
      const shareFrendsApp = new TestApplication(shareFrendsCtx, { width: app.globalData.systemInfo.windowWidth, height: app.globalData.systemInfo.windowHeight })
  
      const date = new Date;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const time = year + '.' + month + '.' + day;   // 绘图的时间
  
      const data = {
        avatar: app.globalData.userInfo.avatarUrl,
        cover: this.data.shareImg,
        qrcode: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
        logo: '',
        name: app.globalData.userInfo.nickName,
        title: this.data.title || '程小元像素画',
        description: this.data.description || '画一副像素画，送给你',
        time: time,
      }
  
      wx.getImageInfo({
        src: data.cover,
        success: res => {
          data.cover = res.path
  
          console.log('绘制图片')
          
          wx.getImageInfo({ // 封面图
            src: data.avatar,
            success: res => {
              data.avatar = res.path
              wx.getImageInfo({
                src: data.qrcode,
                success: res => {
                  data.qrcode = res.path
  
                  shareFrendsApp.createSharePicture(data, {
                    color: this.data.bgColor,
                    fontColor: this.data.fontColor,
                  })
                  // canvas画图需要时间而且还是异步的，所以加了个定时器
                  setTimeout(() => {
                    // 将生成的canvas图片，转为真实图片
                    console.log('生成图片')
                    wx.canvasToTempFilePath({
                      x: 0,
                      y: 0,
                      canvasId: 'shareFrends',
                      success: (res) => {
                        console.log('生成分享图')
                        let shareImg = res.tempFilePath;
                        that.setData({
                          shareImg: shareImg,
                          showShareModal: false,
                          loading: false,
                          showModal: true,
                          currentType: 'setting',
                        })
                        wx.hideLoading()
                      },
                      fail: function (res) {
                        console.log('res', res)
                      }
                    })
                  }, 500)
                }
              })
            },
            fail(err) {
              console.log(err)
            }
          })
        },
        fail(err) {
          console.log('avatar-err: ', err)
        }
      })
    },
  
    // 长按保存事件
    saveImg() {
    },
  }
})

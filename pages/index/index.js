const app = getApp();
import TestApplication from '../../utils/canvasApplication'
import WxUtils from '../../utils/wxUtils'

Page({
  data: {
    PageCur: 'home',
  },
  onLoad() {
    console.log('basics', this.initCanvas)
  },
  NavChange(e) {
    // this.appCanvas.updateGrid(0, 0, '', true)
    this.setData({
      PageCur: e.currentTarget.dataset.cur,
      openSetting: false,
      loading: false,
    })
  },
})

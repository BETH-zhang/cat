import { downloadFile } from '../../api/index'
import { getImagePath } from '../../api/image'
import { jumpPage } from '../../utils/wxUtils'
import config from '../../config'

const app = getApp();
Page({
  data: {
    logo: getImagePath('/home/logo.png'),
    data: config.exploreData,
    loading: false,
  },
  onLoad() {
    this.initData()
  },
  initData() {
    // downloadFile('/json/explore.json', 'json')
    //   .then((data) => {
    //     this.setData({
    //       data,
    //       loading: false,
    //     })
    //   })
  },
  jumpPage(e) {
    const type = 'page' 
    const href = e.currentTarget.dataset.href
    console.log(type, href)
    jumpPage(type, href)
  },
})
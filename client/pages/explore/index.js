import { downloadFile } from '../../api/index'
import { getImagePath } from '../../api/image'
import { jumpPage } from '../../utils/wxUtils'

const app = getApp();
Page({
  data: {
    logo: getImagePath('/home/logo.png'),
    data: [],
    loading: true,
  },
  onLoad() {
    this.initData()
  },
  initData() {
    downloadFile('/json/explore.json', 'json')
      .then((data) => {
        this.setData({
          data,
          loading: false,
        })
      })
  },
  jumpPage(e) {
    const type = 'page' 
    const href = e.currentTarget.dataset.href
    console.log(type, href)
    jumpPage(type, href)
  },
})
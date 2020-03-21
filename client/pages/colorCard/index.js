import { downloadFile } from '../../api/index'
import { getImagePath } from '../../api/image'

const app = getApp();
Page({
  data: {
    logo: getImagePath('/home/logo.png'),
  },
  onLoad() {
    this.initData()
  },
  initData() {
  },
})
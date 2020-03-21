import { downloadFile } from '../../api/index'
import { getImagePath } from '../../api/image'
import { jumpPage } from '../../utils/wxUtils'

const app = getApp();
Page({
  data: {
    logo: getImagePath('/home/logo.png'),
    iconList: [{
      icon: 'icon-invitation',
      color: 'red',
      badge: 0,
      name: 'Banner',
      href: 'adminBanner',
    }, {
      icon: 'icon-invitation',
      color: 'orange',
      badge: 0,
      name: '文章',
      href: 'adminArticle',
    }],
    gridCol: 3,
  },
  onLoad() {
    this.initData()
  },
  initData() {
  },
  jumpPage(e) {
    const type = 'page'
    const href = e.currentTarget.dataset.href
    jumpPage(type, href) 
  },
})
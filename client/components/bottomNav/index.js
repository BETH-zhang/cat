import config from '../../config'
import { jumpPage } from '../../utils/wxUtils'

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageCur: {
      type: String,
      value: 'home'
    },
    menus: {
      type: Array,
      value: config.menus, 
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    pageCur: 'home',
  },
  /**
   * 组件初始化
   */
  attached() {
    const pages = getCurrentPages();
    
    const currentPage = pages[pages.length - 1];
    const curPageUrl = `/${currentPage.route}`
    this.data.menus.forEach((item) => {
      if (item.pageTo === curPageUrl) {
        this.setData({ pageCur: item.key })
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    NavChange(e) {
      const page = e.currentTarget.dataset.cur
      jumpPage('page', page) 
    },
  }
})

import { query } from '../../api/index'
import { getImagePath } from '../../api/image'
import { jumpPage } from '../../utils/wxUtils'
import config from '../../config'

const app = getApp();

Page({
  data: {
    cardCur: 0,
    banners: [],

    navs0: config.homeMenus0,
    navs: config.homeMenus,
  },
  onLoad(options) {
    console.log("home-options:shareTicket", options)
    this.initData()
  },
  initData() {
    query({
      name: 'banner',
    }).then((res) => {
      const data = []
      res.forEach((item, index) => {
        data.push({
          ...item,
          path: item.path.indexOf('https:') === -1 ? getImagePath(item.path) : item.path
        })
      })

      console.log('data: ', data)
      this.setData({ banners: data })
      this.towerSwiper(data);
    })
  },
  selectNav(e) {
    const nav = e.target.dataset.cur;
    jumpPage('page', nav)
  },
  jumpPage(e) {
    const type = e.target.dataset.type
    const href = e.target.dataset.href
    const openImg = e.target.dataset.openimg

    if (href) {
      jumpPage(type, href)
    } else if (openImg) {
      wx.previewImage({
        urls: [getImagePath(openImg)]
      });
    }
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
})
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://wx3.sinaimg.cn/mw690/9f7ff7afly1gb1tdnjoywj20p00an77w.jpg',
    }, {
      id: 1,
      type: 'image',
      url: 'https://wx2.sinaimg.cn/mw690/9f7ff7afly1gb1tdnig4tj20p00dwgy2.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://wx2.sinaimg.cn/mw690/9f7ff7afly1g9feslpr2rj20j60j5djg.jpg',
      link: 'work',
    }],
    navs: [{
      id: 0,
      name: '像素画',
      icon: 'icon-noun__cc',
      link: 'pixel',
      bg: 'bg-gradual-red',
    }, {
      id: 1,
      name: '色卡',
      icon: 'icon-seqia',
      link: 'color',
      bg: 'bg-gradual-orange',
    }, {
      id: 2,
      name: 'AI像素',
      icon: 'icon-wuguan',
      link: 'convert',
      bg: 'bg-gradual-green',
    }, {
      id: 3,
      name: '大师作品',
      icon: 'icon-icon-',
      link: 'work',
      bg: 'bg-gradual-blue',
    }, {
      id: 4,
      name: '程小元',
      icon: 'icon-houzi',
      link: 'about',
      bg: 'bg-gradual-purple',
    // }, {
    //   id: 5,
    //   name: '临摹',
    //   icon: 'icon-fla',
    //   link: '',
    //   bg: 'bg-gradual-pink',
    }, {
      id: 6,
      name: 'Gif图',
      icon: '',
      link: '/pages/gifmaker/index',
      type: 'nav',
      bg: 'bg-gradual-pink',
    }],
  },
  attached() {
    console.log("home")
    this.initData()
    this.towerSwiper('swiperList');
  },
  methods: {
    initData() {
    },
    selectNav(e) {
      console.log('e: ', e)
      const nav = e.currentTarget.dataset.cur;
      const type = e.currentTarget.dataset.type;
      if (nav) {
        switch(type) {
          case 'nav':
            console.log(nav)
            wx.navigateTo({ url: nav })
            break;
          default:
            var myEventDetail = {
              PageCur: nav,
            } // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            this.triggerEvent('homeevent', myEventDetail, myEventOption)
            break;
        }
      }
    },
    jumpPage(e) {
      console.log('e: ', e)
      const swiperIndex = e.target.dataset.cur;
      this.data.swiperList.forEach((item, index) => {
        console.log(index, swiperIndex, item.link, index === swiperIndex)
        if (index === swiperIndex && item.link) {
          var myEventDetail = {
            PageCur: item.link,
          } // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          this.triggerEvent('homeevent', myEventDetail, myEventOption)
        }
      })
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
    towerSwiper(name) {
      let list = this.data[name];
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
  }
})
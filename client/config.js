export default {
  cdn: 'cloud://dev-5x6mb.6465-dev-5x6mb-1301018233',
  env: 'dev-5x6mb',

  colorCard: 'color-card',
  banner: 'banner',
  article: 'article',

  defaultBg: 'https://s2.ax1x.com/2019/11/21/MIeqCd.jpg',
  menus: [{
    id: 0,
    key: 'home',
    name: '首页',
    icon: 'icon-home1',
    pageTo: 'home',
  }, {
    id: 1,
    key: 'colorCard',
    name: '色卡',
    icon: 'icon-color-card',
    pageTo: 'colorCard',
  }, {
    id: 2,
    key: 'pixel',
    name: '像素画',
    icon: 'icon-add',
    pageTo: 'pixel',
  }, {
    id: 3,
    key: 'explore',
    name: '探索',
    icon: 'icon-explore',
    pageTo: 'explore',
  // }, {
  //   id: 3,
  //   key: 'vip',
  //   name: '精选作品',
  //   icon: 'icon-vip',
  //   pageTo: 'vip',
  }, {
    id: 4,
    key: 'user',
    name: '我的',
    icon: 'icon-user',
    pageTo: 'user',
  }],

  homeMenus0: [{
    name: '邀请',
    icon: 'icon-invitation',
    color: 'text-gradual-purple',
    button: true,
  }, {
    name: '攻略',
    icon: 'icon-doc',
    color: 'text-gradual-green',
    pageTo: 'article/index?id=新手教程',
  }, {
    name: '分享',
    icon: 'icon-share1',
    color: 'text-gradual-red',
    button: true,
  }, {
    name: '公众号',
    icon: 'icon-more',
    color: 'text-gradual-orange',
    openImg: '/home/wxgzh.png',
  }],

  homeMenus: [{
    id: 0,
    name: '像素画',
    icon: 'icon-huban',
    link: 'pixel',
    bg: 'bg-gradual-red',
  }, {
    id: 1,
    name: 'AI像素',
    icon: 'icon-ai',
    link: 'ai',
    bg: 'bg-gradual-orange',
  }, {
    id: 3,
    name: '色卡',
    icon: 'icon-color-card',
    link: 'colorCard',
    bg: 'bg-gradual-blue',
  }, {
    id: 2,
    name: '精品作品',
    icon: 'icon-vip',
    link: 'vip',
    bg: 'bg-gradual-pink',
  }],

  exploreData: [
    {
        "title": "作品展示",
        "href": "work-show",
        "bg": "bg-gradual-pink",
        "path": "",
    },
    {
        "title": "名片",
        "href": "qrcode",
        "bg": "bg-gradual-blue",
        "path": "",
    },
    {
        "title": "暴走 GIF",
        "href": "gif",
        "bg": "bg-gradual-green",
        "path": "https://wx4.sinaimg.cn/mw690/9f7ff7afly1g9feta2b4qj20j60j6wi3.jpg"
    },
    {
        "title": "AI 像素",
        "href": "ai",
        "bg": "bg-gradual-orange",
        "path": "https://wx4.sinaimg.cn/mw690/9f7ff7afly1g9feta2b4qj20j60j6wi3.jpg"
    },
    {
        "title": "精选作品",
        "href": "vip",
        "bg": "bg-gradual-red",
        "path": "https://wx4.sinaimg.cn/mw690/9f7ff7afly1g9feta2b4qj20j60j6wi3.jpg"
    },
  ],
}
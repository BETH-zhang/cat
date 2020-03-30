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
    id: 2,
    name: 'Gif图',
    icon: 'icon-gif',
    link: 'gif',
    bg: 'bg-gradual-green',
  }, {
    id: 3,
    name: '色卡',
    icon: 'icon-color-card',
    link: 'colorCard',
    bg: 'bg-gradual-blue',
  }],
}
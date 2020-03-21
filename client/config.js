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
    pageTo: 'index',
  }, {
    id: 1,
    key: 'colorcard',
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
}
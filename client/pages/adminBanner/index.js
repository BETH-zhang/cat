import { chooseImage, jumpPage } from '../../utils/wxUtils' 
import { add, uploadImage, query } from '../../api/index'
import { getImagePath, setImagePath } from '../../api/image'
import config from '../../config'

const app = getApp();
Page({
  data: {
    type: 'page',
    theme: '',
    imgPath: '',
    href: '',
    
    // banners: [{
    //   theme: 'ssss',
    //   path: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg',
    //   // type: 'http',
    //   // href: 'https://uskid.com',
    //   type: 'page',
    //   href: 'article/index?id=1',
    // }],
    banners: [],
  },
  onLoad() {
    this.initData()
  },
  initData() {
    query({
      name: 'banner',
    }).then((res) => {
      const paths = []
      res.forEach((item) => {
        paths.push(getImagePath(item.path))
      })

      wx.cloud.getTempFileURL({
        fileList: paths,
        success: imageRes => {
          // fileList 是一个有如下结构的对象数组
          // [{
          //    fileID: 'cloud://xxx.png', // 文件 ID
          //    tempFileURL: '', // 临时文件网络链接
          //    maxAge: 120 * 60 * 1000, // 有效期
          // }]
          imageRes.fileList.forEach((item, index) => {
            res[index] = {
              ...res[index],
              path: item.tempFileURL
            }
          })
          this.setData({ banners: res })
        },
        fail: console.error
      })
    })
  },
  clearData() {
    this.setData({
      type: 'page',
      theme: '',
      imgPath: '',
      href: '',
    })
  },
  InputTheme(e) {
    this.setData({
      theme: e.detail.value,
    })
  },
  InputHref(e) {
    this.setData({
      href: e.detail.value,
    })
  },
  ChooseImage() {
    chooseImage({ sourceType: ['album'] }).then((res) => {
      this.setData({ imgPath: res.tempFilePaths[0] })
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  AddBanner() {
    if (this.data.theme && this.data.href && this.data.imgPath) {
      uploadImage(this.data.imgPath, `${config.banner}/${this.data.theme}`).then((res) => {
        const path = setImagePath(res.fileID)

        add({
          name: 'banner',
          data: {
            type: this.data.type,
            theme: this.data.theme,
            href: this.data.href,
            status: 1,
            path,
          },
        }).then((res) => {
          wx.showToast({
            title: '添加成功',
          })

          this.clearData()
          this.initData()
        })
      })
    }
  },
  JumpPage(e) {
    const type = e.currentTarget.dataset.type
    const href = e.currentTarget.dataset.href
    jumpPage(type, href)
  },
})
import { chooseImage, jumpPage } from '../../utils/wxUtils' 
import { add, uploadImage, query } from '../../api/index'
import { getImagePath, setImagePath } from '../../api/image'
import config from '../../config'

const app = getApp();
Page({
  data: {
    title: '程小元',
    author: 'Beth',
    content: 'j\nk',
    
    articles: [],
  },
  onLoad() {
    this.initData()
  },
  initData() {
    query({
      name: 'article',
    }).then((res) => {
      const articles = res.map((item) => ({
        ...item,
        path: item.path ? getImagePath(item.path) : config.defaultBg,
        content: item.content.slice(0, 45)
      }))
      this.setData({ articles })
    })
  },
  clearData() {
    this.setData({
      author: 'Beth',
      title: '',
      content: '',
    })
  },
  inputTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },
  inputContent(e) {
    this.setData({
      content: e.detail.value
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
  AddArticle() {
    if (this.data.title && this.data.content) {
      if (this.data.imgPath) {
        uploadImage(this.data.imgPath, `${config.banner}/${this.data.theme}`).then((res) => {
          const path = setImagePath(res.fileID)
  
          this.add(path)
        })
      } else {
        this.add()
      }
    }
  },
  add(path) {
    add({
      name: 'article',
      data: {
        _id: this.data.title,
        title: this.data.title,
        author: this.data.author,
        content: this.data.content,
        status: 1,
        path: path || '',
      },
    }).then((res) => {
      wx.showToast({
        title: '添加成功',
      })

      this.clearData()
      this.initData()
    })
  },
  JumpPage(e) {
    const type = 'page' 
    const id = e.currentTarget.dataset.id
    const path = 'article/index?id=' + id
    jumpPage(type, path)
  },
})
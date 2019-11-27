class WxUtils {
  constructor(wx, app) {
    this.wx = wx
    this.app = app
  }

  getSystemInfo = () => {
    return new Promise((resolve, reject) => {
      this.wx.getSystemInfo({
        success: (res) => {
          resolve(res)
        }
      })
    })
  }

  downLoadImg = (url, storageKeyUrl, callback) => {
    this.wx.getImageInfo({
      src: url,
      success: function(res) {
        this.wx.setStorage({
          key: storageKeyUrl,
          data: {
            path: res.path,
            width: res.width,
            height: res.height,
          },
        })
        if (callback) {
          callback(res)
        }
      }
    })
  }

  getImagePath = (storageKeyUrl, key) => {
    const imageData = wx.getStorageSync(storageKeyUrl);
    
    if (key) {
      return imageData[key] || ''
    }

    return imageData
  }

  loading = (title) => {
    this.wx.showLoading({ title })
  }

  createCtx = (id) => {
    return this.wx.createCanvasContext(id);
  }

  chooseImage = () => {
    this.wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('res: ', res)
        // let imgUrl = res.tempFilePaths[0]
        // // 获取图片大小
        // const imgData = this.downLoadImg(imgUrl)
        // console.log('choose-imgData: ', imgData)
      }
    })
  }

  saveImage = (filePath, success, failure) => {
    this.wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          this.wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              this.wx.saveImageToPhotosAlbum({
                filePath,
                success() {
                  this.wx.showToast({
                    title: '保存成功'
                  })
                  if (success) { success() }
                },
                fail() {
                  this.wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                  if (failure) { failure() }
                }
              })
            },
            fail() {
              if (failure) { failure() }
              // 如果用户拒绝过或没有授权，则再次打开授权窗口
              //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              // that.setData({
              //   openSet: true
              // })
            }
          })
        } else {
          // 有则直接保存
          this.wx.saveImageToPhotosAlbum({
            filePath,
            success() {
              wx.showToast({
                title: '保存成功'
              })
              if (success) { success() }
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
              if (failure) { failure() }
            }
          })
        }
      }
    })
  }

   // 直接预览图片
  previewImage = (data) => {
    const filePaths = typeof data === 'string' ? [data] : data
    this.wx.previewImage({
      urls: filePaths,
    })
  }

  // 拍照
  takePhoto = (callback) => {
    const ctx = this.wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        if (callback) {
          callback(res.tempImagePath, res)
        }
      }
    })
  }

  // 生成图片
  canvasToTempFilePath = (canvasId) => {
    return new Promise((resolve, reject) => {
      this.wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height,
        canvasId,
        complete: res => {
          if (res.errMsg === 'canvasToTempFilePath:ok') {
            resolve(res.tempFilePath, res)
          } else if (failure) {
            reject(res)
          }
        }
      })
    })
  }
}

export default WxUtils
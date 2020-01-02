class WxUtils {
  constructor(wx, app) {
    this.wx = wx
    this.app = app
    this.canvas = {}
  }

  setStyle = (canvas) => {
    this.canvas = canvas
  }

  getSystemInfo = () => {
    return new Promise((resolve, reject) => {
      this.wx.getSystemInfo({
        success: (res) => {
          resolve(res)
        },
        failure: function(res) {
          reject(res)
        }
      })
    })
  }

  downLoadImg = (url, storageKeyUrl) => {
    return new Promise((resolve, reject) => {
      const data = false && this.getImagePath(storageKeyUrl)
      if (data) {
        resolve(data)
      } else {
        this.wx.getImageInfo({
          src: url,
          success: (res) => {
            this.wx.setStorage({
              key: storageKeyUrl,
              data: {
                path: res.path,
                width: res.width,
                height: res.height,
              },
            })
            resolve(res)
          },
          failure: function(res) {
            reject(res)
          }
        })
      }
    })
  }

  getImagePath = (storageKeyUrl, key) => {
    const imageData = this.wx.getStorageSync(storageKeyUrl);
    
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
    return new Promise((resolve, reject) => {
      this.wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log('res: ', res)
          resolve(res)
          // let imgUrl = res.tempFilePaths[0]
          // // 获取图片大小
          // const imgData = this.downLoadImg(imgUrl)
          // console.log('choose-imgData: ', imgData)
        },
        failure: function(res) {
          reject(res)
        }
      })
    })
  }

  saveImage = (filePath, that) => {
    return new Promise((resolve, reject) => {
      this.wx.getSetting({
        success: (res) => {
          // 如果没有则获取授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            this.wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                this.wx.saveImageToPhotosAlbum({
                  filePath,
                  success() {
                    this.wx.showToast({
                      title: '保存成功'
                    })
                    resolve()
                  },
                  fail() {
                    this.wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                    reject()
                  }
                }, that)
              },
              fail() {
                reject()
              }
            }, that)
          } else {
            // 有则直接保存
            this.wx.saveImageToPhotosAlbum({
              filePath,
              success: () => {
                this.wx.showToast({
                  title: '保存成功'
                })
                resolve()
              },
              fail() {
                this.wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
                reject()
              }
            }, that)
          }
        }
      })
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
    return new Promise((resolve, reject) => {
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          resolve(res)
        },
        failure: function(res) {
          reject(res)
        }
      })
    })
  }

  // 生成图片
  canvasToTempFilePath = (canvasId, that, options = {}) => {
    return new Promise((resolve, reject) => {
      this.wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height,
        canvasId,
        quality: 10,
        ...options,
        complete: res => {
          console.log('canvasToTempFilePath-res: ', res)
          if (res.errMsg === 'canvasToTempFilePath:ok') {
            resolve({
              ...res,
              width: this.canvas.width,
              height: this.canvas.height,
            })
          } else {
            reject(res)
          }
        }
      }, that)
    })
  }

  // 获取元素样式
  createSelectorQuery = (element, that) => {
    return new Promise((resolve, reject) => {
      var query = wx.createSelectorQuery().in(that);
      query.select(element).boundingClientRect((rect) => {
        if (rect) {
          resolve(rect)
        } else {
          reject() 
        }
      }).exec();
    })
  }
}

export default WxUtils
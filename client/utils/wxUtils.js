export const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: (res) => {
        resolve(res)
      },
      failure: (res) => {
        reject(res)
      }
    })
  })
}

export const downLoadImg = (url, that) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        resolve(res)
      },
      failure: (res) => {
        reject(res)
      }
    }, that)
  })
}

export const getImagePath = (storageKeyUrl, key) => {
  const imageData = wx.getStorageSync(storageKeyUrl);
  
  if (key) {
    return imageData[key] || ''
  }

  return imageData
}

export const chooseImage = (options, that) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      ...options,
      success: (res) => {
        resolve(res)
      },
      failure: (res) => {
        reject(res)
      }
    }, that)
  })
}

export const saveImage = (filePath, that) => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              wx.saveImageToPhotosAlbum({
                filePath,
                success() {
                  wx.showToast({
                    title: '保存成功'
                  })
                  resolve()
                },
                fail() {
                  wx.showToast({
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
          wx.saveImageToPhotosAlbum({
            filePath,
            success: () => {
              wx.showToast({
                title: '保存成功'
              })
              resolve()
            },
            fail() {
              wx.showToast({
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

export const previewImage = (data, that) => {
  const filePaths = typeof data === 'string' ? [data] : data
  wx.previewImage({
    urls: filePaths,
  }, that)
}

export const takePhoto = (that) => {
  const ctx = wx.createCameraContext(that)
  return new Promise((resolve, reject) => {
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        resolve(res)
      },
      failure: (res) => {
        reject(res)
      }
    })
  })
}

export const canvasToTempFilePath = (canvasId, options = {}, that) => {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvasId,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      quality: 10,
      ...options,
      complete: res => {
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          resolve({
            ...res,
            width: options.width || 100,
            height: options.height || 100,
          })
        } else {
          reject(res)
        }
      }
    }, that)
  })
}

export const createSelectorQuery = (element, that) => {
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

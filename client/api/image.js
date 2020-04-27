import config from '../config'

export const setImagePath = (path) => {
  return path ? path.replace(config.cdn, '') : ''
}

export const getImagePath = (path) => {
  return path ? `${config.cdn}${path}` : ''
}

export const getTempFileURL = (paths) => new Promise((resolve, reject) => {
  wx.cloud.getTempFileURL({
    fileList: paths,
    success: res => {
      resolve(res)
      // fileList 是一个有如下结构的对象数组
      // [{
      //    fileID: 'cloud://xxx.png', // 文件 ID
      //    tempFileURL: '', // 临时文件网络链接
      //    maxAge: 120 * 60 * 1000, // 有效期
      // }]
    },
    fail: (err) => {
      reject(err)
      console.error(err)
    }
  })
})
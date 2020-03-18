import config from '../config'

let db = null

export const highFunction = (name) => {
  const collectionName = config[name]
  db = db || wx.cloud.database()

  return (func) => {
    return new Promise((resolve, reject) => {
      if (collectionName) {
        func(collectionName, resolve, reject)
      } else {
        reject('no db')
      }
    })
  }
}

export const uploadImage = () => {

}

export const downloadFile = (path, type) => new Promise((resolve, reject) => {
  wx.cloud.downloadFile({
    fileID: `${config.cdn}${path}`,
  }).then((res) => {
    console.log('downloadFile: ', res)
    if (res.statusCode === 200) {
      wx.getFileSystemManager()
        .readFile({
          filePath: res.tempFilePath,
          encoding: 'utf-8',
          success: res => {
            if (type === 'json') {
              resolve(JSON.parse(res.data))
            } else {
              resolve(res.data)
            }
          },
          fail: (err) => {
            reject({ error: err })
          }
        })
    } else {
      reject({ error: '文件不存在' })
    }
  })
})

export const addCollection = ({ name, data }) => highFunction(name)((collectionName, resolve, reject) => {
  let count = 0
  const len = data.length
  data.forEach((item) => {
    db.collection(collectionName).add({data: item}).then((res) => {
      count++
      console.log(res, count)

      if (count === len) {
        resolve(len)
      }
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
})

export const add = ({ name, data }) => highFunction(name)((collectionName, resolve, reject) => {
  db.collection(collectionName).add({ data }).then((res) => {
    resolve(res)
  }).catch((err) => {
    reject(err)
  })
})

export const del = ({ name, data }) => highFunction(name)((collectionName, resolve, reject) => {
  db.collection(collectionName).add({ data }).then((res) => {
    resolve(res)
  }).catch((err) => {
    reject(err)
  })
})

export const query = ({ name, data }) => highFunction(name)((collectionName, resolve, reject) => {
  console.log(collectionName)
})

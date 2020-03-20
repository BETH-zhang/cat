import config from '../config'

export const setImagePath = (path) => {
  return path ? path.replace(config.cdn, '') : ''
}

export const getImagePath = (path) => {
  return `${config.cdn}${path}`
}
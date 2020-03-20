export const isArray = (value) => {
    return Array.isArray(value)
}

export const isFunction = (value) => {
    return typeof value === 'function'
}

export const isObject = (value) => {
    return typeof value === 'object' && !isArray(value) && `${value}` == '[object Object]' 
}

export const isString = (value) => {
    return typeof value === 'string'
}
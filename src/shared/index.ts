export const extend = Object.assign

export const isObject = (val) => {
  return val !== null && typeof val === 'object'
}

// Object.is() 方法判断两个值是否为同一个值。
export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal)
}

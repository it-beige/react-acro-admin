type TObjectType = 'Object' | 'Array'

export function isType(v, type: TObjectType): boolean {
  return Object.prototype.toString.call(v) === `[object ${type}]`
}

export function isObject(v) {
  return isType(v, 'Object')
}

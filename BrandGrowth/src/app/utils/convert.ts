/**
 * 将字符串转化为布尔类型
 * @param value 
 * @return boolean
 */
export function toBoolean(value: boolean | string): boolean {
  return value === '' || (value && value !== 'false');
}

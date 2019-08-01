/**
 * 检查参数是否为undefined或null
 * @param value 
 * @return boolean
 */
export function isNotNil(value: undefined | null | string | number | boolean): boolean {
  return (typeof (value) !== 'undefined') && value !== null;
}

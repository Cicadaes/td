/**
 * 检查参数是否为undefined或null
 * @param value 
 * @return boolean
 */
export function arrayJudgement(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Array]';
}

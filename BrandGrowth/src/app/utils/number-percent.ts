
export const numberPercent = (value: any, percent: boolean = false) => {
  // 判断是否为整型
  const isInt = (num: any) => typeof num === 'number' && num % 1 === 0;

  if (value === Infinity || value === -Infinity || isNaN(value)) {
    return 'N/A';
  }

  let rtn = '';
  if (isInt(value)) {
    rtn = percent ? `${value}.00%` : `${value}.00`;
  } else {
    rtn = percent ? `${value.toFixed(2)}%` : value.toFixed(2);
  }
  return rtn;
}

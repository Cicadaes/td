export class retentionModel {
  retentionHeaders: any = [
    { value: '首次使用日', label: '首次使用日' },
    { value: '用户数', label: '用户数' },
    { value: '+1日', label: '+1日' },
    { value: '+2日', label: '+2日' },
    { value: '+3日', label: '+3日' },
    { value: '+4日', label: '+4日' },
    { value: '+5日', label: '+5日' },
    { value: '+6日', label: '+6日' },
    { value: '+7日', label: '+7日' },
    { value: '+14日', label: '+14日' },
    { value: '+30日', label: '+30日' }
  ]; //留存率headerconter
  /*
   * 颜色转换
   * @param startColor
   * @param endColor
   * @param step
   */
  radientColor(startColor, endColor, step) {
    let startRGB = this.colorRgb(startColor); //转换为rgb数组模式
    let startR = startRGB[0];
    let startG = startRGB[1];
    let startB = startRGB[2];
    let endRGB = this.colorRgb(endColor);
    let endR = endRGB[0];
    let endG = endRGB[1];
    let endB = endRGB[2];
    let sR = (endR - startR) / step; //总差值
    let sG = (endG - startG) / step;
    let sB = (endB - startB) / step;
    let colorArr = [];
    for (let i = 0; i < step; i++) {
      //计算每一步的hex值
      let hex = this.colorHex(
        `rgb(${parseInt(sR * i + startR)},${parseInt(sG * i + startG)} ,${parseInt(sB * i + startB)})`
      );
      colorArr.push(hex);
    }
    return colorArr;
  }

  // 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
  colorRgb(sColor) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let _sColor = sColor.toLowerCase();
    if (_sColor && reg.test(_sColor)) {
      if (_sColor.length === 4) {
        let sColorNew = '#';
        for (let i = 1; i < 4; i += 1) {
          sColorNew += _sColor.slice(i, i + 1).concat(_sColor.slice(i, i + 1));
        }
        _sColor = sColorNew;
      }
      //处理六位的颜色值
      let sColorChange = [];
      for (let j = 1; j < 7; j += 2) {
        sColorChange.push(parseInt('0x' + _sColor.slice(j, j + 2)));
      }
      return sColorChange;
    } else {
      return _sColor;
    }
  }
  // 将rgb表示方式转换为hex表示方式
  colorHex(rgb) {
    let _this = rgb;
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(_this)) {
      let aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, '').split(',');
      let strHex = '#';
      for (let i = 0; i < aColor.length; i++) {
        let hex = aColor[i].toString(16);
        hex = hex < 10 ? `0${hex}` : hex; // 保证每个rgb的值为2位
        if (hex === '0') {
          hex += hex;
        }
        strHex += hex;
      }
      if (strHex.length !== 7) {
        strHex = _this;
      }
      return strHex;
    } else if (reg.test(_this)) {
      let aNum = _this.replace(/#/, '').split('');
      if (aNum.length === 6) {
        return _this;
      } else if (aNum.length === 3) {
        let numHex = '#';
        for (let ti = 0; ti < aNum.length; ti += 1) {
          numHex += aNum[ti] + aNum[ti];
        }
        return numHex;
      }
    } else {
      return _this;
    }
  }
}

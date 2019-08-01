import { Injectable } from '@angular/core';

@Injectable()
export class ObjectTrimService {

  constructor() {
  }

  /**
   * 去除字符串尾首的空格
   * @param  {any}    data [description]
   * @return {[type]}      [description]
   */
  public objTrim(data: any) {
    // 这里不支持ES8的新功能
    for (let key of Object.keys(data)) {
      (typeof data[key] == 'string') && data[key].trim && (data[key] = data[key].trim())
    }
  }


}

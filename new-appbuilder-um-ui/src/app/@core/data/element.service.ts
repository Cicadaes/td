import { Injectable } from '@angular/core'

@Injectable()
export class ElementService {
  constructor() { }

  // class
  private ngTableScrollBody: string = 'ant-table-body'


  // 获取元素
  /**
   * 获取ant-design的table的滚动区域对应的元素
   * @return {string} [description]
   */
  get scrollBody(): string {
    return this.ngTableScrollBody
  }

}

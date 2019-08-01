// 处理功能列表的数据

import { Injectable } from '@angular/core'

@Injectable()

export class ApplistService {

  constructor() { }

  /**
   * 删除icon参数，防止前端参数文件过大
   * @param  {any}    data [description]
   * @return {[type]}      [description]
   */
  public deleteIcon(data: any) {
    if (data && data.length) {
      data.forEach((item: any) => {
        delete item.icon
        for (let sitem of Object.keys(item)) {
          if (item[sitem] instanceof Array) {
            this.deleteIcon(item[sitem])
          }
        }
      })
      return data
    }
  }

  /**
   * 根据数据1的值给数组2赋值
   * @param  {any}    arr1 [description]
   * @param  {any}    arr2 [description]
   * @return {[type]}      [description]
   */
  public syncAppCheck(arr1: any, arr2: any) {
    if (arr1 && arr1.length && arr2 && arr2.length) {
      arr2.forEach((item: any, index: number) => {
        for (let sitem of arr1) {
          if (item.id == sitem.id && item.appId == sitem.appId) {
            if (item.children && item.children.length && sitem && sitem.children && sitem.children.length) {
              this.syncAppCheck(sitem.children, item.children)
            }
            item.checked = sitem.checked
            break
          }
        }
      })
    }
  }

  /**
   * 清空check
   * @return {[type]} [description]
   */
  public setNoCheck(arr: any) {
    if (arr && arr.length) {
      arr.forEach((item: any) => {
        item.checked = false
        this.setNoCheck(item.children)
      })
    }
  }

}

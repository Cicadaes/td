// 处理角色列表的数据

import { Injectable } from '@angular/core'

@Injectable()

export class RoleListService {
  constructor() { }

  /**
   * 移除默认的租户管理员角色
   * @param  {any = []}          data [description]
   * @return {[type]}   [description]
   */
  public rmDefaultItem(data: any = []): any {
    if (data && data.length) {
      data = data.filter((item: any) => {
        return item.code != 'UM_TENANT_ADMIN'
      })
    }
    return data
  }
}

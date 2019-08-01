import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';

@Injectable()
export class UserGroupService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
    this.baseUrl = '/crowd';
  }

  getCrowdList(params?: any) {
    let url = `${this.baseUrl}/crowd/crowds/query/-1`;
    if (params && params.parentId) {
      url = `${this.baseUrl}/crowd/crowds/query/${params.parentId}`;
    }
    if (params) {
      url += this.getParams(params);
    }
    return this.http.get(url);
  }

  /**
   * 删除人群
   */
  deleteCrowdById(crowdId: number) {
    const url = `${this.baseUrl}/crowd/crowds/${crowdId}`;
    return this.http.delete(url);
  }

  /**
   * 获取数据字典
   */
  getParam(body: any) {
    const url = `${this.baseUrl}/admin/dic/constant/query`;
    const json = {
      data: body
    };
    return this.http.post(url, json);
  }
}

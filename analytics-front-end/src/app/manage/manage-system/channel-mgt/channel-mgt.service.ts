import { Injectable, Injector } from '@angular/core';
import { CurdService } from 'src/app/curd.service';

@Injectable()
export class ChannelMgtService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  /**
   * 获取渠道列表
   * @param param
   */
  getChannelList(param: any) {
    let url: any = `${this.reportBaseUrl}/channel/list`;
    for (const key in param) {
      if (param.hasOwnProperty(key)) {
        const element = param[key];
        if (!element && element !== 0) {
          delete param[key];
        }
      }
    }
    return this.http.post(url, param);
  }

  /**
   * 修改渠道
   * @param param
   */
  updateChannel(param: any): any {
    let url: any = `${this.reportBaseUrl}/channel/update`;
    return this.http.put(url, param);
  }
}

import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../../../curd.service';

@Injectable()
export class EventFilterService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  // 查询属性备选列表
  metaAttributeList() {
    const configUrl: any = `/crowd/meta/metaAttribute/listDetails/${this.getProductId()}`;
    return this.http.get(configUrl);
  }

  // 查询字典
  queryDict(dictName: any) {
    const configUrl: any = '/crowd/admin/dic/query';
    return this.http.post(configUrl, { data: [dictName] });
  }

  // 查询字典2，包含所有Tag类型的枚举值，模糊搜索
  queryDict2(dictName: any, searchValue: any) {
    const configUrl: any = '/crowd/admin/dicItems/query';
    return this.http.post(configUrl, {
      dicItemAliasOrValue: searchValue,
      dicItemKey: dictName,
      productId: this.getProductId()
    });
  }

  // 获取事件列表2
  getEvent2(parentId, searchValue) {
    const param = `?page=1&rows=99999999&dicItemKey=eventid&eventTypeId=${parentId}&dicItemAliasOrValue=${searchValue}`;
    const configUrl: any = `/crowd/admin/dic/event/item${param}`;
    return this.http.get(configUrl);
  }

  // 获取事件属性备选列表
  getEventParams(behavior) {
    const configUrl: any = `/crowd/meta/metaAttribute/getEventParams?eventId=${behavior}`;
    return this.http.get(configUrl);
  }

  // 获取现有人群列表
  queryExistingCrowd(param: any) {
    let configUrl: any = `/crowd/crowd/crowds/query/effective?productId=${param.productId}`;
    return this.http.post(configUrl, param);
  }

  // 获取现有标签
  queryExistingTag(param: any) {
    const url: any = `${this.crowdApiBaseUrl}/tag/tagCategory/tag/dropdown/query`;
    return this.http.post(url, param);
  }
}

import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CrowdCreateService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  // 查询属性备选列表
  metaAttributeList() {
    const configUrl: any = '/crowd/meta/metaAttribute/listDetails/' + localStorage.getItem('productId');
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
      productId: localStorage.getItem('productId')
    });
  }
  // 查询字典2，包含所有Tag类型的枚举值，模糊搜索
  _queryDict2(dictName: any, searchValue: any, page?: number, data: any = []) {
    if (data && data.length) {
      data = Array.from(new Set(data));
    } else {
      data = [];
    }
    const configUrl: any = '/crowd/admin/dicItems/batch/query';
    return this.http.post(configUrl, {
      dicItemAliasOrValue: searchValue,
      dicItemKey: dictName,
      productId: localStorage.getItem('productId'),
      rows: 20,
      page: page,
      ids: data && data.length ? data.join(',') : ''
    });
  }

  // 获取事件列表2
  getEvent2(parentId, searchValue) {
    let url = '/crowd/admin/dic/event/item?page=1&rows=99999999&dicItemKey=eventid&eventTypeId=';
    const configUrl = `${url}${parentId}&dicItemAliasOrValue=${encodeURIComponent(searchValue)}`;
    return this.http.get(configUrl);
  }

  // 获取事件属性备选列表
  getEventParams(behavior) {
    const configUrl: any = `/crowd/meta/metaAttribute/getEventParams?eventId=${behavior}`;
    return this.http.get(configUrl);
  }

  // 获取现有人群列表
  queryExistingCrowd(parentId = -1, crowdId = -1) {
    let configUrl: any = `/crowd/crowd/crowds/query/-1?page=1&rows=99999999`;
    if (crowdId !== -1) {
      configUrl = `/crowd/crowd/crowds/query/-1?id=${crowdId}&page=1&rows=99999999`;
    }

    if (parentId !== -1) {
      configUrl = `/crowd/crowd/crowds/query/${parentId}?page=1&rows=99999999`;
    }

    if (parentId !== -1 && crowdId !== -1) {
      configUrl = `/crowd/crowd/crowds/query/${parentId}?id=${crowdId}&page=1&rows=99999999`;
    }
    return this.http.get(configUrl);
  }

  // 获取现有标签
  queryExistingTag(param: any) {
    const url: any = this.crowdApiBaseUrl + '/tag/tagCategory/tag/dropdown/query';
    return this.http.post(url, param);
  }

  // 获取Json
  queryCrowd(crowdId: any) {
    const configUrl: any = `${this.crowdApiBaseUrl}/crowd/crowds/find/${crowdId}`;
    return this.http.get(configUrl);
  }

  // 保存Jsons
  saveCrowd(json: any) {
    const configUrl: any = `${this.crowdApiBaseUrl}/crowd/crowds/realtime/create`;
    const obs = this.http.post(configUrl, json);
    return obs;
  }

  // 更新Jsons
  updateCrowd(json: any, crowdId: any) {
    const configUrl: any = `${this.crowdApiBaseUrl}/crowd/crowds/update/${crowdId}`;
    const obs = this.http.put(configUrl, json);
    return obs;
  }

  // 重新计算
  restart(crowdId: any) {
    const configUrl: any = `${this.crowdApiBaseUrl}/crowd/crowds/realtime/restart/${crowdId}`;
    const obs = this.http.get(configUrl);
    return obs;
  }
}

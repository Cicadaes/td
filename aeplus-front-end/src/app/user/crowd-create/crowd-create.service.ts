import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';

@Injectable()
export class CrowdCreateService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
    }

    // 查询属性备选列表
    metaAttributeList() {
        const configUrl: any = '/crowd/meta/metaAttribute/listDetails/' + this.productId;
        return this.http.get(configUrl);
    }

    // 查询字典
    queryDict(dictName: any) {
        const configUrl: any = '/crowd/admin/dic/query';
        return this.http.post(configUrl, {'data': [dictName]});
    }

    // 查询字典2，包含所有Tag类型的枚举值，模糊搜索
    queryDict2(dictName: any, searchValue: any) {
        const configUrl: any = '/crowd/admin/dicItems/query';
        return this.http.post(configUrl, {
            'dicItemAliasOrValue': searchValue,
            'dicItemKey': dictName,
            'productId': this.productId
        });
    }

    // 获取事件列表2
    getEvent2(parentId, searchValue) {
        const configUrl: any = '/crowd/admin/dic/event/item?page=1&rows=99999999&dicItemKey=eventid&eventTypeId=' + parentId + '&dicItemAliasOrValue=' + searchValue;
        return this.http.get(configUrl);
    }

    // 获取事件属性备选列表
    getEventParams(behavior) {
        const configUrl: any = '/crowd/meta/metaAttribute/getEventParams' + '?eventId=' + behavior;
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
        const configUrl: any = this.crowdApiBaseUrl + '/crowd/crowds/find/' + crowdId;
        return this.http.get(configUrl);
    }

    // 保存Jsons
    saveCrowd(json: any) {
        const configUrl: any = this.crowdApiBaseUrl + '/crowd/crowds/realtime/create';
        const obs = this.http.post(configUrl, json);
        return obs;
    }

    // 更新Jsons
    updateCrowd(json: any, crowdId: any) {
        const configUrl: any = this.crowdApiBaseUrl + '/crowd/crowds/update/' + crowdId;
        const obs = this.http.put(configUrl, json);
        return obs;
    }

    // 重新计算
    restart(crowdId: any) {
        const configUrl: any = this.crowdApiBaseUrl + '/crowd/crowds/realtime/restart/' + crowdId;
        const obs = this.http.get(configUrl);
        return obs;
    }

}

import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';

@Injectable()
export class TagCreateService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
    }

    // 查询属性备选列表
    metaAttributeList() {
        const configUrl: any = this.crowdApiBaseUrl + '/meta/metaAttribute/listDetails/' + this.productId;
        return this.http.get(configUrl);
    }

    // 查询字典
    queryDict(dictName: any) {
        const configUrl: any = this.crowdApiBaseUrl + '/admin/dic/query';
        return this.http.post(configUrl, {'data': [dictName]});
    }

    // 查询字典2，包含所有Tag类型的枚举值，模糊搜索
    queryDict2(dictName: any, searchValue: any) {
        const configUrl: any = this.crowdApiBaseUrl + '/admin/dicItems/query';
        return this.http.post(configUrl, {
            'dicItemAliasOrValue': searchValue,
            'dicItemKey': dictName,
            'productId': this.productId
        });
    }

    // 获取事件列表
    getEvent(searchValue) {
        let configUrl: any = this.crowdApiBaseUrl + '/meta/metaAttribute/getEvent?currentPage=1&pageSize=100';
        if (searchValue) {
            configUrl += '&searchValue=' + searchValue;
        }
        return this.http.get(configUrl);
        // searchValue
    }

    // 获取事件列表2
    getEvent2(parentId, searchValue) {
        const configUrl: any = '/crowd/admin/dic/event/item?page=1&rows=99999999&dicItemKey=eventid&eventTypeId=' + parentId + '&dicItemAliasOrValue=' + searchValue;
        return this.http.get(configUrl);
    }

    // 获取事件属性备选列表
    getEventParams(behavior) {
        const configUrl: any = this.crowdApiBaseUrl + '/meta/metaAttribute/getEventParams' + '?eventId=' + behavior;
        return this.http.get(configUrl);
    }

    // 获取现有标签
    queryExistingTag(param: any) {
        const url: any = this.crowdApiBaseUrl + '/tag/tagCategory/tag/dropdown/query?page=1&rows=99999999';
        return this.http.post(url, param);
    }

    // 获取Json
    queryTag(tagId: any) {
        const configUrl: any = this.crowdApiBaseUrl + '/tag/customTags/' + tagId + '/find';
        return this.http.get(configUrl);
    }

    // 保存Jsons
    saveTag(json: any) {
        const configUrl: any = this.crowdApiBaseUrl + '/tag/customTags/save';
        const obs = this.http.post(configUrl, json);
        return obs;
    }

    // 更新Jsons
    updateTag(json: any, tagId: any) {
        const configUrl: any = this.crowdApiBaseUrl + '/tag/customTags/save';
        const obs = this.http.post(configUrl, json);
        return obs;
    }

    // 重新计算
    restart(tagId: any) {
        const url = this.crowdApiBaseUrl + '/tag/customTags/' + tagId + '/restartCalc';
        const obs = this.http.get(url);
        return obs;
    }

    // 查询计算参数
    queryCalcParam() {
        const url = this.crowdApiBaseUrl + '/admin/param/query?key=custom.tag.calc.schedule.hh_mm';
        const obs = this.http.get(url);
        return obs;
    }
}

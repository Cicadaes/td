import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class UserConfiguredService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
    }

    // /crowd/config/metaAttributeGroup/listDetails 查询选中属性接口
    getCheckedArrtibute(params: any) {
        const stringParams = this.getParams(params);
        return this.http.get('/crowd/config/metaAttributeGroup/listDetails' + stringParams).pipe(
            catchError(this.handleError)
        );
    }

    // /crowd/meta/metaAttribute/listDetails/{productId} 查询全量属性接口
    getAllArrtibute() {
        return this.http.get(`/crowd/meta/metaAttribute/listDetails/${this.productId}`).pipe(
            catchError(this.handleError)
        );
    }

    // /crowd/admin/param/query 查询属性个数
    getAttributeCount(params: any) {
        const stringParams = this.getParams(params);
        return this.http.get('/crowd/admin/param/query' + stringParams).pipe(
            catchError(this.handleError)
        );
    }

    // /crowd/config/metaAttributeGroup 保存属性接口
    insertArrtibute(params: any) {
        return this.http.post('/crowd/config/metaAttributeGroup', params).pipe(
            catchError(this.handleError)
        );
    }

    // /crowd/config/configCrowdPortraits 查询人群画像配置列表
    getPortrait(params: any) {
        const stringParams = this.getParams(params);
        return this.http.get('/crowd/config/configCrowdPortraits' + stringParams).pipe(
            catchError(this.handleError)
        );
    }

    // /crowd/config/configCrowdPortraits 新建人群画像组
    insertPortrait(params: any) {
        return this.http.post('/crowd/config/configCrowdPortraits', params).pipe(
            catchError(this.handleError)
        );
    }

    // /crowd/config/configCrowdPortraits/{configCrowdPortraitId}  编辑人群画像组
    editPortrait(configCrowdPortraitId: any, params: any) {
        return this.http.put('/crowd/config/configCrowdPortraits/configCrowdPortrait', params).pipe(
            catchError(this.handleError)
        );
    }

    // /crowd/config/configCrowdPortraits/{configCrowdPortraitId}  删除人群画像组名称
    daletePortrait(configCrowdPortraitId: any, reportId: any, productId: any) {
        return this.http.delete(`/crowd/config/configCrowdPortraits/${configCrowdPortraitId}/${reportId}/${this.productId}`).pipe(
            catchError(this.handleError)
        );
    }

    // /crowd/config/configCrowdPortraits/checkConfigCrowdPortraitName   人群画像组名称是否重复
    checkPortraitName(params: any) {
        return this.http.post('/crowd/config/configCrowdPortraits/checkConfigCrowdPortraitName', params).pipe(
            catchError(this.handleError)
        );
    }

    // /crowd/config/configCrowdPortraits/checkConfigCrowdPortraitSortOrder   显示顺序是否重复
    checkPortraitSortOrder(params: any) {
        return this.http.post('/crowd/config/configCrowdPortraits/checkConfigCrowdPortraitSortOrder', params).pipe(
            catchError(this.handleError)
        );
    }

    /*查询标签分类*/
    queryTagCategories(params: any) {
        return this.http.post(this.crowdApiBaseUrl + '/tag/tagCategory/tree/query', params).pipe(
            catchError(this.handleError)
        );
    }

    /*创建标签分类*/
    createTagCategory(params: any) {
        return this.http.post(this.crowdApiBaseUrl + '/tag/tagCategory/create', params).pipe(
            catchError(this.handleError)
        );
    }

    /*编辑标签分类*/
    editTagCategory(params: any, item: any) {
        return this.http.post(this.crowdApiBaseUrl + '/tag/tagCategory/' + item.id  + '/update', params).pipe(
            catchError(this.handleError)
        );
    }

    /*删除标签分类*/
    delTagCategory(item: any) {
        return this.http.get(this.crowdApiBaseUrl + '/tag/tagCategory/' + item.id  + '/delete').pipe(
            catchError(this.handleError)
        );
    }

    getAppConfig() {
        const url = this.reportBaseUrl + '/index';
        return this.http.get(url);
    }
}

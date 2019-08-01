import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";
import { P } from '@angular/cdk/keycodes';

@Injectable()
export class FuncAuthHomeService extends CRUDService{
    constructor(public http: Http) {
        super(http);
    }

    queryTenantApp(roleApp:any) {
        let queryTenantAppUrl = '/console-api/role/queryTenantApp';
        return this.http
            .post(queryTenantAppUrl, JSON.stringify(roleApp), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryVRoleApp(roleApp:any) {
        let queryVRoleAppUrl = '/console-api/role/queryVRoleApp';
        return this.http
            .post(queryVRoleAppUrl, JSON.stringify(roleApp), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryAppFuncType(roleApp:any) {
        let queryAppFuncTypeUrl = '/console-api/role/queryAppFuncType';
        return this.http
            .post(queryAppFuncTypeUrl, JSON.stringify(roleApp), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    authorizeFunctionListUrl:string = '/console-api/role/authorizeFunctionList';
    authorizeFunctionList(data:any) {
        return this.http
            .post(this.authorizeFunctionListUrl, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryTenantAppList(tenant: any){
        let getAllAppListUrl = '/console-api/appController/queryTenantAppAllList';
        return this.http.post(`${getAllAppListUrl}`, tenant,{headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    queryAppListByRoleId(data:any) {
        let queryAppListByRoleIdUrl:string = '/console-api/role/queryAppListByRoleId';
        return this.http
            .post(queryAppListByRoleIdUrl, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    
    /**
     * 获取数据对象权限列表
     * @param param 参数
     */
   queryDataauthByRoleId(param){
    let queryUrl = `/dataauth/dataauth/targetRoleAuthRels/queryListByRoleId?roleId=${param.roleId}&&tenantId=${param.tenantId}`;
    return this.http
        .get(queryUrl, {headers: this.headers})
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
   }

   /**
    * 更新数据对象权限列表
    * @param data 数据
    */
   updateDataauth(data){
    let queryUrl = `/dataauth/dataauth/targetRoleAuthRels/updateRoleAutList`;
    return this.http
        .put(queryUrl, data , {headers: this.headers})
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
   }

   /**
    * 查询数据明细授权列表
    * @param param 参数
    */
   queryDataDetailByRoleId(param){
    let queryUrl = `/dataauth/dataauth/detailAuths/queryByRoleId?${this.formatParams(param)}`;
    return this.http
        .get(queryUrl, {headers: this.headers})
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
   }

   /**
    * 删除明细授权数据对象实例
    * @param ids 实例id
    */
   deleteDetailAuthByIds(ids: any){
    let queryUrl = `/dataauth/dataauth/targetDetailAuths/batchDeleteByIds?ids=${ids}`;
    return this.http
        .delete(queryUrl, {headers: this.headers})
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
   }

   /**
    * 查看明细授权角色权限
    * @param param 参数
    */
   findDetailAuth(param){
       let queryUrl = `/dataauth/dataauth/targetDetailAuths/findDetailAuth?${this.formatParams(param)}`;
       return this.http
       .get(queryUrl, {headers: this.headers})
       .toPromise()
       .then(response => response.json())
       .catch(this.handleError);
   }


   /**
    * 获取数据对象的角色操作权限
    * @param param 参数
    */
   getDetailAuthByTargetId(targetId){
    let queryUrl = `/dataauth/dataauth/targetInstanceOperators/queryListByTargetId?targetId=${targetId}`;
    return this.http
    .get(queryUrl, {headers: this.headers})
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
}

   /**
    * 查询数据对象实例列表
    * @param param 参数
    */
   queryRestDetail(param){
       let queryUrl = `/dataauth/dataauth/targetDetailAuths/queryRestDetail?${this.formatParams(param)}`;
       return this.http
       .get(queryUrl, {headers: this.headers})
       .toPromise()
       .then(response => response.json())
       .catch(this.handleError);

   }
   
   /**
    * 批量新建明细授权角色权限
    * @param data 
    */
   createDetailAuth(data){
   
    let queryUrl = `/dataauth/dataauth/targetDetailAuths/batchCreate`
    return this.http
    .post(queryUrl, JSON.stringify(data), {headers: this.headers})
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
   }

   /**
    * 编辑数据对象实例的操作权限
    * @param data 
    */
   updateTargetDetailAuths(data){
    let queryUrl = `/dataauth//dataauth/targetDetailAuths`
    return this.http
    .put(queryUrl, JSON.stringify(data), {headers: this.headers})
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
   }

   

   /**
    * 格式化参数
    * @param data 参数对象
    */
   formatParams(data){
       let param = '';
       if(data){
           Object.keys(data).forEach(key => {
               param += `&${key}=${data[key]}`;
           })
           param = param.substr(1);
       }
       return param;
   }
}
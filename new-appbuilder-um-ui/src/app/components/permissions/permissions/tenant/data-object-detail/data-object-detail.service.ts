import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/components/common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class DataObjectDetailService extends CRUDService {

	constructor(
		http: Http
	) {
		super(http);
	}

	/**
     * 获取数据对象操作列表
     * @param param 
     */
    getDataObjOperateList(param?: any) {
		let url = `/dataauth/dataauth/targetOperators/rows?`;
		url += this.getParams(param);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
	}

	/**
     * 保存数据对象操作
     * @param param 
     */
    saveDataObjOperate(param: any) {
        let url = `/dataauth/dataauth/targetOperators`;
        return this.http
            .post(url, param)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
	}

	/**
     * 更新数据对象操作
     * @param param 
     */
    updateDataObjOperate(param: any) {
        let url = `/dataauth/dataauth/targetOperators`;
        return this.http
            .put(url, param)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
	}
	
	/**
     * 删除数据对象操作
     * @param param 
     */
    deleteDataObjOperate(id: any) {
        let url = `/dataauth/dataauth/targetOperators/${id}`;
        return this.http
            .delete(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
	}
	
	/**
     * 保存数据对象实例操作
     * @param param 
     */
    saveDataObjInstanceOperate(param: any) {
        let url = `/dataauth/dataauth/targetInstanceOperators`;
        return this.http
            .post(url, param)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
	}
	
	/**
     * 删除数据对象实例操作
     * @param param 
     */
    deleteDataObjInstanceOperate(id: any) {
        let url = `/dataauth/dataauth/targetInstanceOperators/${id}`;
        return this.http
            .delete(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
	}
	
	/**
     * 修改数据对象实例操作
     * @param param 
     */
    updateDataObjInstanceOperate(param: any) {
        let url = `/dataauth/dataauth/targetInstanceOperators`;
        return this.http
            .put(url, param)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
	}
	
	/**
     * 获取数据对象实例操作列表
     * @param param 
     */
    getDataObjInstanceOperateList(param?: any) {
		let url = `/dataauth/dataauth/targetInstanceOperators/rows?`;
		url += this.getParams(param);
        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}

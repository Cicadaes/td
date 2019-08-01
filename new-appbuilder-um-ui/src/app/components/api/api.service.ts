import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from '../common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class ApiService extends CRUDService {

    baseUrl = '/apimanager-api';
    serviceUrl = '/apimanager-api/meta/metas/service';

    constructor(public http: Http) {
        super(http);
    }

    // 获取产品级联列表
    getProductList() {
        return this.http.get(`${this.baseUrl}/meta/catalogs/cascade?parentId=0`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    // 获取产品级联列表
    getProductList2() {
        return this.http.get(`${this.baseUrl}/meta/catalogs/cascade`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    // 获取产品级联列表
    getAllProductList() {
        return this.http.get(`${this.baseUrl}/meta/catalogs/all`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    // 新增产品分类
    insertProduct(params: any) {
        return this.http.post(`${this.baseUrl}/meta/catalogs`, params, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    // 编辑产品分类
    updateProduct(params: any) {
        return this.http.put(`${this.baseUrl}/meta/catalogs`, params, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 检验产品下的接口是否被使用
    checkDeleteProduct(id: any) {
        return this.http.get(`${this.baseUrl}/meta/catalogs/check/${id}`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    // 删除版本
    deleteProduct(id: any) {
        return this.http.delete(`${this.baseUrl}/meta/catalogs/${id}`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    // 获取所有域名列表
    getDomainName(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.baseUrl}/meta/domains/queryByCatalog` + str, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }



    /**==================================      接口相关接口     ================================= */

    // 获取接口列表
    getInterfaceList(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.baseUrl}/meta/metas` + str, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取接口列表
    getInterfaceDetail(id: any) {
        return this.http.get(`${this.baseUrl}/meta/metas/${id}`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 新建接口
    insertInterface(parmas: any) {
        const url = `${this.baseUrl}/meta/metas`;
        return this.http.post(url, parmas, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 编辑接口
    updateInterface(parmas: any) {
        const url = `${this.baseUrl}/meta/metas`;
        return this.http.put(url, parmas, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 复制版本
    copyInterface(parmas: any) {
        const url = `${this.baseUrl}/meta/metas/copy`;
        return this.http.put(url, parmas, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 删除版本
    deleteInterface(id: any) {
        return this.http.delete(`${this.baseUrl}/meta/metas/${id}`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取所属服务
    getService(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.serviceUrl}` + str, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**==================================      版本相关接口     ================================= */

    // 获取版本列表
    getVersionList(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.baseUrl}/meta/versions` + str, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取当前版本的历史版本
    getProductVersion(catalogId: any, status = 0) {
        let str = `${this.baseUrl}/meta/versions/listOldVersions/${catalogId}`;
        if (status) {
            str = `${this.baseUrl}/meta/versions/listOldVersions/${catalogId}?status=${status}`;
        }
        return this.http.get(str, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取版本详情
    getVersionDetail(versionId: any) {
        return this.http.get(`${this.baseUrl}/meta/versions/${versionId}`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    // 新建版本
    insertVersion(parmas: any, copyFlag: any, versionId: any) {
        let url;
        if (copyFlag) {
            url = `${this.baseUrl}/meta/versions/create/1?oldVersionId=${versionId}`;
        } else {
            url = `${this.baseUrl}/meta/versions/create/0`;
        }
        return this.http.post(url, parmas, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 编辑版本
    updateVersion(parmas: any) {
        const url = `${this.baseUrl}/meta/versions`;
        return this.http.put(url, parmas, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 复制版本
    copyVersion(copyFlag: any, oldVersionId: any, newVersionId: any) {
        let url;
        if (copyFlag) {
            url = `${this.baseUrl}/meta/versions/copy/1?oldVersionId=${oldVersionId}&newVersionId=${newVersionId}`;
        } else {
            url = `${this.baseUrl}/meta/versions/copy/0?oldVersionId=${oldVersionId}&newVersionId=${newVersionId}`;
        }
        return this.http.post(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    // 删除版本
    deleteVersion(id: any) {
        return this.http.delete(`${this.baseUrl}/meta/versions/${id}`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    getParams(params: any): string {
        const arr = [];
        for (const name in params) {
            if (true) {
                arr.push(name + '=' + params[name]);
            }
        }
        return '?' + arr.join('&');
    }


    // 获取返回码列表
    getResponseCode(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.baseUrl}/meta/responseCodes/filterByMeta` + str, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }
}

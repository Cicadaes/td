import { Injectable, Injector } from '@angular/core';
import { CurdService } from 'src/app/common/services/crud.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiDocService extends CurdService {
    constructor(private injector: Injector) {
        super(injector);
    }

    // 获取接口详情
    getInterfaceDetail(id: any) {
        return this.http.get(`${this.baseUrl}/meta/metas/rest/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    // 查询当前最新版本api
    getOneApi(parmas: any) {
        const str = this.getParams(parmas);
        return this.http.get(`${this.baseUrl}/meta/metas/rest/getMeta` + str).pipe(
            catchError(this.handleError)
        );
    }

    // 获取产品级联列表
    getProductList() {
        return this.http.get(`${this.baseUrl}/meta/catalogs/cascade/rest?parentId=0`).pipe(
            catchError(this.handleError)
        );
    }

    // 查询版本
    getVersionList(catalogId: any) {
        return this.http.get(`${this.baseUrl}/meta/versions/rest?catalogId=${catalogId}&page=1&pageSize=99999&status=1`).pipe(
            catchError(this.handleError)
        );
    }

    // 查询接口
    getInterfaceList(parmas: any) {
        const str = this.getParams(parmas);
        return this.http.get(`${this.baseUrl}/meta/metas/rest` + str).pipe(
            catchError(this.handleError)
        );
    }
}

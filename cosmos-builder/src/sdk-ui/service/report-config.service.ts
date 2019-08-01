import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";


@Injectable()
export class ReportConfigService extends CRUDService {

    globalParamList: any = [];//全局参数列表

    constructor(http: Http) {
        super(http);
        this.queryRouter = "metaObjects";
    }

    /**
     * 元数据列表接口
     * @param dataSourceId
     */
    public queryMetaList(dataSourceId?: any): Promise<any[]> {
        let url = `${this.baseUrl}/${this.queryRouter}/rest/rows`;
        if (dataSourceId) {
            url += `?dataSourceId=${dataSourceId}`;
        }
        return this.http.get(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 获取全局参数
     * @param dataSourceId
     */
    public queryGlobalParamList(): Promise<any[]> {
        let url = `${this.baseUrl}/reportGlobalParams/allGlobalParams`;
        return this.http.get(url, { headers: this.headers })
            .toPromise()
            .then(response => {
                this.globalParamList = response.json();
                return response.json();
            })
            .catch(this.handleError);
    }

    /**
     * 元数据属性接口
     * @param dataSourceId
     */
    public queryMetaAttr(id: number): Promise<any[]> {
        let url = `${this.baseUrl}/${this.queryRouter}/metaAttributes/rest/${id}`;
        return this.http.get(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    /**
     * 定制属性接口
     * @param dataSourceId
     */
    public customqueryMetaAttr(id: number): Promise<any[]> {
        let url = `${this.download}/query/attributes`;
        return this.http.post(url, JSON.stringify(id), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    /**
    * 定制属性下拉框接口
    * @param dataSourceId
    */
    public customFilter(id: number): Promise<any[]> {
        let url = `${this.customfilter}/dicts/dicItems`;
        return this.http.post(url, JSON.stringify(id), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    /**
     * 获取图表数据
     * @param data 
     */
    public queryChartData(data: any): Promise<any[]> {
        let url = `${this.baseUrl}/chart/data`;
        return this.http.post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    /**
     * 数据字典接口
     * @param dicId
     */
    public queryDicData(dicId: number, queryParams: any): Promise<any[]> {
        let url = `${this.baseUrl}/dicts/${dicId}/dicItems?` + queryParams;
        return this.http.get(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 下载图表数据
     * @param data 
     */
    public queryDownloadData(data: any): Promise<any[]> {
        let url = `${this.download}/download/data`;
        return this.http.post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

}
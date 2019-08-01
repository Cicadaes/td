import { BaseResourceService } from '../base.resource.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PipelineSegmentGroups extends BaseResourceService {
    /**
     * pipeLine 投放分组接口
     */

    constructor(public http: Http) {
        super(http);
        this.saveRouter = 'campaign/pipelineSegmentGroups';
        this.removeRouter = 'campaign/pipelineSegmentGroups';
        this.updateRouter = 'campaign/pipelineSegmentGroups';
        this.getRouter = 'campaign/pipelineSegmentGroups';
        this.queryRouter = 'campaign/pipelineSegmentGroups';
    }

    /**
     * @param groupName
     */
    save(groupName: string): Promise<any> {
        let url = `${this.baseUrl}/${this.saveRouter}/create/${groupName}`;
        return this.http.post(url, {}, {headers: this.headers})
            .toPromise()
            .then(res => {
                if (res['_body']) {
                    res.json();
                }
            }).catch(this.handleError);
    }

    /**
     * 根据groupName获取分组列表
     * @param groupName 
     */
    getGroupList(groupName: string): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/query/${groupName}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 根据groupName删除分组
     * @param groupName 
     */
    deleteGroup(groupName: string): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/delete/${groupName}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(res => {
                if (res['_body']) {
                    res.json();
                }
            }).catch(this.handleError);
    }
}
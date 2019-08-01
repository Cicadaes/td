import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class PipelineDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/pipelineDefinitions";
        this.removeRouter = "campaign/pipelineDefinitions";
        this.updateRouter = "campaign/pipelineDefinitions";
        this.getRouter = "campaign/pipelineDefinitions";
        this.queryRouter = "campaign/pipelineDefinitions";
    }

    /**
     * 获取营销流程列表
     */
    public query(query?: any): Promise<any> {
        var queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let url = `${this.baseUrl}/${this.queryRouter}/rows` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 跟新pipeLine数据
     * 错误返回：
     *  1.转换失败（前端数据格式不满足后端需要）
     *  2.只有草稿、已下线、审批未通过的营销流程可以修改 (errcode: 11511)
     *  3.组件ID重复 (errcode: 11500)
     *  4.后端直接返回错误 (errcode: 4000)
     */
    public updatePipeline(actionType: number, definition: any): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/${actionType}`;
        return this.http.put(url, definition, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    /**
     * 新建pipeLine数据
     */
    public savePipeLine(status: number, pipelineDefinition: any): Promise<any> {
        let url = `${this.baseUrl}/${this.saveRouter}/${status}`;
        return this.http.post(url, JSON.stringify(pipelineDefinition), {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**
     * 获取pipeLine数据
     */
    public findPipeLine(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${id}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**
     * 获取pipeLine数据根据活动Id
     */
    public findPipeLineByCampaignId(id: number): Promise<any> {
        let url = `${this.baseUrl}/campaign/pipelineDefinitions/campaignId/${id}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**  
     * 修改营销流程状态
     */
    public updateStatus(id: number,status: number): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/${id}/${status}`;
        return this.http.patch(url, {headers: this.headers})
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    /**
     * 系统管理员同意上线请求 营销流程变成已上线
     */
    public onlineProcess(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/approvePipelineDefinition/${id}`;
        return this.http.patch(url, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
    /**
     * 系统管理员将营销流程下线 营销流程变成已下线
     */
    public offlineProcess(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/offlinePipelineDefinition/${id}`;
        return this.http.patch(url, {headers: this.headers})
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    /**
     * 系统管理员不同意上线请求 营销流程变成测试通过
     */
    public testpassProcess(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/rejectPipelineDefinition/${id}`;
        return this.http.patch(url, {headers: this.headers})
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    /**
     * 检索Pipeline分流组件的维度数据
     */
    public getDimensionList(): Promise<any> {
        let url = `${this.baseUrl}/campaign/pipelineDefinitions/config/splitNode/dimension`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 检索PipeLine分流组件的维度的选项数据
     */
    public getDimensionById(dimensionId: any): Promise<any> {
        let url = `${this.baseUrl}/campaign/pipelineDefinitions/config/splitNode/dimension/${dimensionId}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 检测pipeLine数据是否正确
     */
    public check(pipeLineDefinition: any): Promise<any> {
        let url = `${this.baseUrl}/${this.saveRouter}/check`;
        return this.http.post(url, JSON.stringify(pipeLineDefinition), {headers: this.headers})
         .toPromise()
         .then(res => res)
         .catch(this.handleError);
    }
    
    /**
     * 检索pipeLine事件
     * 触发器 scope 为 5
     * 计时器 scope 为 4
     */
    public getEvent(scope: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/config/event/${scope}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 检索pipeLine全局禁止规则
     */
    public getForbiddenRule(): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/config/forbiddenRule`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 检索pipeLine分流组件的维度数据
     */
    public getDimension(): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/config/splitNode/dimension`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 检索pipeLine指标
     */
    public getIndex(campaignId: any): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/config/${campaignId}/index`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 检索PipeLine提前终止规则
     */
    public getTerminationRule(campaignId: number, pipelineDefinitionId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/config/${campaignId}/${pipelineDefinitionId}/terminationRule`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取过滤器标签列表
     * http://127.0.0.1:1111/marketing-api/campaign/pipelineDefinitions/config/behaviorDefinitions/tags
     */
    public getFilterTags(): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/config/behaviorDefinitions/tags`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    public getFileter(): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/config/behaviorDefinitions`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取触发器同时满足条件的指标列表
     */
    public getOtherTargets(campaignId: number, pipelineDefinitionId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/config/${campaignId}/${pipelineDefinitionId}/triggerNodeIndex`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    
    /**
     * 上传黑名单
     * @param data 
     */
    public uploadBlacklist(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/upload/blacklist`;
        return this.http.post(url, data, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 检索Pipeline短信应用中的自定义标签
     * @param formData 
     */
    public getShortMessageLabel(pipelineDefinitionId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/config/${pipelineDefinitionId}/shortMessageLabel`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 检索Pipeline有效权益
     * @param formData 
     */
    public getRemainEquity(pipelineDefinitionId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${pipelineDefinitionId}/remain/equity`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * pipeLine提交
     * @param pipeLineId
     */
    public submit(pipeLineId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/submit/${pipeLineId}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * pipeLine获取禁止规则列表
     * @param pipeLineId
     * @param type
     */
    public getForbidRuleList(pipeLineId: number, type: string): Promise<any> {
        let url =`${this.baseUrl}/${this.getRouter}/${pipeLineId}/forbidrules/${type}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}
import { ConfigApi } from "../../../../api/config-api";
import { BaseDataGraph } from "../../common/base-data.graph";
import { EventEmitter, EventType, DataStore } from "cosmos-td-sdk";
import { DataStoreUtil, dataType } from "../../../../api/data-store-util";
import { ReportConfigService } from "../../../../service/report-config.service";

export class TableDataGraph extends BaseDataGraph {

    constructor(
        reportConfigService: ReportConfigService,
        // panelData?: {queryParam: any, scope: string},
        // obj?: { queryParam: any, scope: string, linkageData: any, callback?: () => void },
        obj: any,//两种类型   1、不带callback和过滤条件的 2、带callback和过滤条件的
    ) {
        super(reportConfigService);
        if (obj["callback"]) {
            this.queryChartData(obj);
        } else{
            this.getChartData(obj["queryParam"], obj["scope"]);
        }
    }

    /**
     * 构建请求参数的维度
     * @param data
     */
    buildRequestDimensions(data: any) {
        let dimensions = [];
        if (!data) {
            return
        }
        data = this.distinctField(data);
        for (let i = 0; i < data.length; i++) {
            let dimension = {
                "field": data[i]["value"],
                "alias": data[i]["value"]
            }
            dimensions.push(dimension);
        }
        return dimensions;
    }

    /**
     * 构建请求参数的指标
     * @param data
     */
    buildRequestMetrics(data: any, linkageData: any) {
        let metrics = [];
        if (!data) {
            return
        }
        if (linkageData && linkageData.length > 0) { //外围组件指标筛选
            let field = "";
            linkageData.forEach((element: any) => {
                if(element && element["metrics"]){
                    field = element && element["metrics"];
                }
            });
            if (field) {
                metrics.push({
                    "field": field,
                    "aggregator": "sum",//目前只支持sum 2018-03-15 20:21:01
                    "alias": field
                });
                return metrics;
            }
        }
        data = this.distinctField(data);
        if (data && data.length == 1) {
            let metric = {
                "field": data[0]["value"],
                "aggregator": "sum",//目前只支持sum 2018-03-15 20:21:01
                "alias": data[0]["value"]
            }
            metrics.push(metric);
        } else {
            for (let i = 0; i < data.length; i++) {
                let metric = {
                    "field": data[i]["value"],
                    "aggregator": "sum",//目前只支持sum 2018-03-15 20:21:01
                    "alias": data[i]["value"]
                }
                metrics.push(metric);
            }
        }
        return metrics;
    }

    beforeRequest(queryChartParam: any, scope: string, linkageData?: any) {
        if (!this.checkQueryChartParam(queryChartParam, scope)) {
            EventEmitter.trigger(EventType.DATACHANGE,
                {
                    scope: scope,
                    data: {
                        code: "300",
                        data: []
                    }
                }
            );
            return;
        }
        
        let param = {
            cubeId: queryChartParam["cube"],
            dimensions: this.buildRequestDimensions(queryChartParam["dimensions"]),
            metrics: this.buildRequestMetrics(queryChartParam["metrics"], linkageData),
            groupBy: this.buildRequestGroupBy(queryChartParam["dimensions"]),
            orderBy: this.buildRequestOrderBy(queryChartParam),
            limit: {
                page: 1,
                pageSize: 100
            }
        };

        if (param["orderBy"] && param["orderBy"].length == 0) {
            delete param["orderBy"];
        }

        //图表是表格时单独处理
        //是表格的时候需要传 total:true  获取总条数
        param["total"] = true;
        param["limit"]["pageSize"] = 10;
        if (linkageData && linkageData.length > 0) {
            linkageData.forEach((element: any) => {
                if (element && element["page"]) {
                    param["limit"]["page"] = element["page"];
                    param["limit"]["pageSize"] = element["pageSize"] || 10;
                    if(element["orderBy"] && element["orderBy"].length > 0){
                        let obj = {
                            orderBy: element["orderBy"],
                            dimensions: queryChartParam['dimensions']
                        };
                        param["orderBy"] = this.buildTableRequestOrderBy(obj, linkageData);
                    }
                }
            });
        }
        return param;
    }

    /**
    * 构建排序字段
    * @param selectedOrderBy
    * @param selectedOrder
    */
    buildTableRequestOrderBy(queryChartParam: any, linkageData?: any) {
        if(queryChartParam['orderBy']){
            let arr: any = [];
            if (linkageData && linkageData.length > 0) {
                let field = "";
                linkageData.forEach((element: any) => {
                    if (element && element["metrics"]) {
                        field = element["metrics"];
                    }
                });
                if (field) {
                    let len = queryChartParam['orderBy'].length;
                    let hasMetric:boolean = false;
                    let order:any = null;
                    for (let i = 0; i < len; i++) {
                        if (this.checkDimensionHasField(queryChartParam['dimensions'],  queryChartParam['orderBy'][i]['field'])) {
                            if(queryChartParam['orderBy'][i]["field"]){
                                arr.push({
                                    field:queryChartParam['orderBy'][i]['field'],
                                    order:queryChartParam['orderBy'][i]['order']
                                });
                            }
                        }else{
                           
                            if(!hasMetric){
                                order = queryChartParam['orderBy'][i]['order'];
                            }
                            hasMetric = true;
                        }
                    }
                    if(hasMetric){
                        arr.push({
                            field: field,
                            order: order
                        });
                    };

                }else{
                    for (let i = 0; i < queryChartParam['orderBy'].length; i++) {
                        if (queryChartParam['orderBy'][i]["field"]) {
                            arr.push({
                                field:queryChartParam['orderBy'][i]['field'],
                                order:queryChartParam['orderBy'][i]['order']
                            });
                        }
                    }
                }
            }
            return arr;
        }
        
        
    }

    doRequest(param: any, scope: string, callback: ()=> void){
        setTimeout(() => {
            this.reportConfigService.queryChartData([param]).then(data => {
                if (data && data["_body"]) {
                    data = JSON.parse(data["_body"]);
                }
                let returnData: any = {
                    code: 200
                };
                if (data["data"][0]["data"] && data["data"][0]["data"].length > 0) {
                    returnData.data = data["data"];
                } else {
                    returnData.data = data["data"][0]["data"];
                }
                EventEmitter.trigger(EventType.DATACHANGE,
                    {
                        scope: scope,
                        data: returnData
                    }
                );

                callback && callback();

            }).catch(err => {
                EventEmitter.trigger(EventType.DATACHANGE,
                    {
                        scope: scope,
                        data: {
                            code: "500",
                            data: err
                        }
                    }
                );
            });
        }, 10);
    }
}
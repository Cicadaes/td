import { ConfigApi } from "../../../../api/config-api";
import { BaseDataGraph } from "../../common/base-data.graph";
import { EventEmitter, EventType, DataStore } from "cosmos-td-sdk";
import { DataStoreUtil, dataType } from "../../../../api/data-store-util";
import { ReportConfigService } from "../../../../service/report-config.service";

export class RetentionDataGraph extends BaseDataGraph {

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
        dimensions.push({
            "field": data,
        });
        return dimensions;
    }

    /**
     * 构建后端请求需要的数据 groupBy
     * @param data
     */
    buildRequestGroupBy(data: any) {
        let groupBy = [];
        if (!data) {
            return
        }
        groupBy.push({
            "field": data
        });
        return groupBy;
    }

    /**
     * 构建请求参数的指标
     * @param data
     */
    buildRequestMetrics(data: any, linkageData: any) {
        let metrics = [];
        let metric = {
            "field": data[0]["value"],
            "aggregator": "sum",//目前只支持sum 2018-03-15 20:21:01
            "alias": data[0]["value"]
        }
        metrics.push(metric);
        return metrics;
    }

    /**
     * 检查参数
     * @param queryChartParam 
     */
    checkQueryChartParam(queryChartParam: any, scope?: string) {
       
        if (!queryChartParam || !queryChartParam["cube"] || !queryChartParam["metrics"]) {
            return false;
        }
        
        if (queryChartParam["metrics"].length) {
            for (let i = 0; i < queryChartParam["metrics"].length; i++) {
                if (!queryChartParam["metrics"][i]["value"]) {
                    return false;
                }
            }
        }
        if(!queryChartParam["dateDimension"] || !queryChartParam["checkDimension"] || (!queryChartParam["checkDimensionValue"] && queryChartParam["checkDimensionValue"] != 0)
            || !queryChartParam["retainDimension"] || (!queryChartParam["retainDimensionValue"] && queryChartParam["retainDimensionValue"] != 0) || !queryChartParam["time"]){
            return false;
        }

        return true;
    }

    /**
     * 处理过滤器和时间
     * @param param 
     * @param queryChartParam 
     * @param scope 
     * @param linkageData 
     */
    processFilterAndDate(param: any, queryChartParam: any, scope: string, linkageData?: any){
        let filter = DataStoreUtil.getFilterData(scope, queryChartParam["cube"]);
        if (filter || queryChartParam["dateDimension"]) {
            if(!param["filters"]){
                param["filters"] = [];
            }
            //处理过滤器的数据
            for (let key in filter) {
                param["filters"] = param["filters"].concat(this.filterData(filter[key]));
            }
            if(linkageData && linkageData.length > 0){
                linkageData.forEach((element: any) => {
                    if (element && element["dateRange"]) {
                        param["filters"].shift();
                        param["filters"].push(this.buildRetainDateFilter(queryChartParam["dateDimension"], queryChartParam["time"], element["dateRange"]));
                    }
                })
            }
        }
        return param;
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
            dimensions: this.buildRequestDimensions(queryChartParam["dateDimension"]),
            metrics: this.buildRequestMetrics(queryChartParam["metrics"], linkageData),
            groupBy: this.buildRequestGroupBy(queryChartParam["dateDimension"]),
            limit: {
                page: 1,
                pageSize: 1000
            },
            specialMark: "KEEP"
        };

        param["interval"] = {
            "field": queryChartParam["dateDimension"],
            "granularity": "day"
        };

        param["filters"] = [];

        param["filters"].push(this.buildRetainDateFilter(queryChartParam["dateDimension"], queryChartParam["time"]));
        param["filters"].push(this.buildDimensionValueFilter(queryChartParam["checkDimension"],queryChartParam["checkDimensionValue"]));
        param["filters"].push(this.buildDimensionValueFilter(queryChartParam["retainDimension"],queryChartParam["retainDimensionValue"]));

        //留存自带筛选器触发时
        if (linkageData && linkageData.length > 0) {
            linkageData.forEach((element: any) => {
                if (element && element["retainFilterData"]) {
                    param["filters"] = [];
                    param["filters"].push(this.buildRetainDateFilter(element["retainFilterData"]["dateDimension"], queryChartParam["time"], element["retainFilterData"]["datetime"]));
                    param["filters"].push(this.buildDimensionValueFilter(element["retainFilterData"]["checkDimension"], element["retainFilterData"]["checkDimensionValue"]));
                    param["filters"].push(this.buildDimensionValueFilter(element["retainFilterData"]["retainDimension"],element["retainFilterData"]["retainDimensionValue"]));
                }
            });
        }

        return param;
    }

    /**
     * 构建留存的日期过滤
     * @param dimension 
     * @param time 
     */
    buildRetainDateFilter(dimension: string, time: number, datatime?: any){
        return {
            "type": "and",
            "condition": [
                {
                    "field": dimension,
                    "operator": ">=",
                    "value": datatime? datatime[0]: this.getBeforeDate(time)
                },
                {
                    "field": dimension,
                    "operator": "<=",
                    "value": datatime? datatime[1]: this.getBeforeDate(1)
                }
            ]
        };
    }

    /**
     * 根据维度和维度值构建filter
     * @param dimension 
     * @param dimensionValue 
     */
    buildDimensionValueFilter(dimension: string, dimensionValue: string){
        return {
            "type": "and",
            "condition": [
                {
                    "field": dimension,
                    "operator": "=",
                    "value": dimensionValue
                }
            ]
        };
    }
}
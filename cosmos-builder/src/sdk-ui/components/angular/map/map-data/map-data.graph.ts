import { ConfigApi } from "../../../../api/config-api";
import { BaseDataGraph } from "../../common/base-data.graph";
import { EventEmitter, EventType, DataStore } from "cosmos-td-sdk";
import { DataStoreUtil, dataType } from "../../../../api/data-store-util";
import { ReportConfigService } from "../../../../service/report-config.service";

export class MapDataGraph extends BaseDataGraph {

    constructor(
        reportConfigService: ReportConfigService,
        // panelData?: {queryParam: any, scope: string},
        // obj?: { queryParam: any, scope: string, linkageData: any, callback?: () => void },
        obj: any,//两种类型   1、不带callback和过滤条件的 2、带callback和过滤条件的
    ) {
        super(reportConfigService);
        if (obj["callback"]) {
            this.queryChartData(obj);
        } else {
            this.getChartData(obj["queryParam"], obj["scope"]);
        }
    }
    /**
   * 构建请求参数的维度
   * @param data
   */
    buildRequestDimensions(data: any): any {
        let dimensions = [];
        if (!data) {
            return
        }
        data = this.distinctField(data);
        for (let i = 0; i < data.length; i++) {
            let dimension = {
                "field": data[i]["value"],
                "alias": i == 0 ? "name" : "Legend"
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
                if (element && element["metrics"]) {
                    field = element && element["metrics"];
                }
            });
            if (field) {
                metrics.push({
                    "field": field,
                    "aggregator": "sum",//目前只支持sum 2018-03-15 20:21:01
                    "alias": "value"
                });
                return metrics;
            }
        }
        data = this.distinctField(data);
        if (data && data.length == 1) {
            let metric = {
                "field": data[0]["value"],
                "aggregator": "sum",//目前只支持sum 2018-03-15 20:21:01
                "alias": "value"
            }
            metrics.push(metric);
        } else {
            for (let i = 0; i < data.length; i++) {
                let metric = {
                    "field": data[i]["value"],
                    "aggregator": "sum",//目前只支持sum 2018-03-15 20:21:01
                    "alias": ("sum_" + data[i]["value"])
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
            limit: {
                page: 1,
                pageSize: 1000
            }
        };

        if (queryChartParam["metrics"] && queryChartParam["metrics"].length > 1) {
            param["columnToRow"] = this.buildRequestColumnToRow(param["metrics"]);
        }

        return param;
    }
}
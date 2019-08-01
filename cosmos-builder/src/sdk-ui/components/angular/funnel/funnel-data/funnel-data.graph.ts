import { ConfigApi } from "../../../../api/config-api";
import { BaseDataGraph } from "../../common/base-data.graph";
import { EventEmitter, EventType, DataStore } from "cosmos-td-sdk";
import { DataStoreUtil, dataType } from "../../../../api/data-store-util";
import { ReportConfigService } from "../../../../service/report-config.service";

export class FunnelDataGraph extends BaseDataGraph {

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

        if (queryChartParam["dimensions"].length == 1) {
            param["columnToRow"] = this.buildRequestColumnToRow(param["metrics"]);
        }

        //漏斗步骤处理
        let funnelStep = DataStoreUtil.getDataFromConfigData(scope, dataType.FUNNELSTEPDATA);
        if (funnelStep) {
            param["valueMapFormat"] = this.buildRequestValueMapFormat(param["dimensions"], funnelStep);
            param["customOrders"] = this.buildRequestCustomOrders(param["dimensions"], funnelStep);
            if (!param["filters"]) {
                param["filters"] = [];
            }
            param["filters"].push(this.buildRequestFunnelFilter(funnelStep));
        }

        return param;
    }
    /**
     * 发起请求
     */
    doRequest(param: any, scope: string, callback: () => void) {
        setTimeout(() => {
            this.reportConfigService.queryChartData([param]).then(data => {
                if (data && data["_body"]) {
                    data = JSON.parse(data["_body"]);
                }
                let returnData: any;
                if (data && data["data"] && data["data"][0] && data["data"][0]["data"] && data["data"][0]["data"].length != 0) {
                    returnData = {
                        code: "200",
                        data: [data["data"][0]["data"], data["data"]],
                    };
                } else {
                    returnData = {
                        code: "200",
                        data: [],
                    };
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
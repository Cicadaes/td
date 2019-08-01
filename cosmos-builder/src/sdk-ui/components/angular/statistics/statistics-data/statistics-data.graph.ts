import { ConfigApi } from "../../../../api/config-api";
import { BaseDataGraph } from "../../common/base-data.graph";
import { EventEmitter, EventType, DataStore } from "cosmos-td-sdk";
import { DataStoreUtil, dataType } from "../../../../api/data-store-util";
import { ReportConfigService } from "../../../../service/report-config.service";

export class StatisticsDataGraph extends BaseDataGraph {

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
    checker(queryChartParam: any, scope?: string) {
       
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

        return true;
    }

    beforeRequest(queryChartParam: any, scope: string, linkageData?: any) {
        if (!this.checker(queryChartParam, scope)) {
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
            metrics: this.buildRequestMetrics(queryChartParam["metrics"], linkageData),
            groupBy: this.buildRequestGroupBy(queryChartParam["dimensions"]),
            limit: {
                page: 1,
                pageSize: 100
            }
        };

        if (queryChartParam["metrics"] && queryChartParam["metrics"].length > 1) {
            param["columnToRow"] = this.buildRequestColumnToRow(param["metrics"]);
        }
        return param;
    }
}
import { ConfigApi } from "../../../../api/config-api";
import { BaseDataGraph } from "../../common/base-data.graph";
import { EventEmitter, EventType, DataStore } from "cosmos-td-sdk";
import { DataStoreUtil, dataType } from "../../../../api/data-store-util";
import { ReportConfigService } from "../../../../service/report-config.service";

export class PieDataGraph extends BaseDataGraph {
    contdata: any;
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
            other: true,
            sumMetric:true,
            limit: {
                page: 1,
                pageSize: 1000
            }
        };

        if (queryChartParam["dimensions"].length == 1) {
            param["columnToRow"] = this.buildRequestColumnToRow(param["metrics"]);
        }

        //TODO:与后端沟通，该处暂时可以使用pageSize限制（因为饼图的维度只能选择一个）;条形图条数需和若彬沟通再处理；
        if (queryChartParam["count"]) {
            param.limit.pageSize = queryChartParam["count"];
        }

        let dimensionValueData = DataStore.getConfigData(scope)['dataConfig'][dataType.DIMENSIONVALUELIST];
        if (dimensionValueData && queryChartParam["dimensions"][0]) {
            //处理过滤器的数据
            if (!param["filters"]) {
                param["filters"] = [];
            }
            let options = dimensionValueData['options'] ? dimensionValueData['options'] : dimensionValueData;
            let valueList: any = [];
            let data: any = {
                dimension: queryChartParam["dimensions"][0]['value'],
                dimensionValueData: valueList
            }
            options.forEach((item: any) => {
                if (item.checked) {
                    valueList.push(item.value);
                }
            });
            param["filters"].push(this.buildDimensionValueFilter(data));
        }
        return param;
    }

    buildDimensionValueFilter(data: any) {
        let dimensionValueFilter: any = {
            "type": "and",
            "condition": [
                {
                    "field": data["dimension"],
                    "operator": "in",
                    "value": []
                }
            ]
        };

        data["dimensionValueData"].forEach((element: any) => {
            let values = (element + '').split(",");
            if (values.length > 1) {//“其他”处理
                dimensionValueFilter["type"] = "not";
                values.forEach((value: any) => {
                    dimensionValueFilter["condition"][0]["value"].push(value);
                });
            } else {
                dimensionValueFilter["condition"][0]["value"].push(element);
            }
        });

        return dimensionValueFilter;
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
                    if (data["data"][0]["sumMetric"]["Y"] == 0 || data["data"][0]["sumMetric"]["Y"] == 0.00) {
                        returnData = {
                            code: "200",
                            data: [],
                        };
                    } else {
                        this.contdata = this.dCopy(data["data"][0]["data"]);
                        let lengths: any = data["data"][0]["data"].length;
                        for (let i = 0; i < lengths; i++) {
                            data["data"][0]["data"][i]["Y"] = Number(data["data"][0]["data"][i]["Y"]);
                            if (data["data"][0]["data"][i]["Y"] == 0) {
                                data["data"][0]["data"][i]["Y"] = 0;
                                // this.contdata.splice(i, 1);
                            } else {
                                let numb = (data["data"][0]["data"][i]["Y"] / data["data"][0]["sumMetric"]["Y"]).toFixed(2);
                                if (numb == "0.00") {
                                    data["data"][0]["data"][i]["Y"] = 0;
                                    // this.contdata.splice(i, 1)
                                }
                            }
                        }
                        let dentent = data["data"][0]["data"].filter(function (item: any) {
                                 return item['Y'] !== 0;
                        });
                        data["data"][0]["data"] = dentent;
                    }
                    if (data["data"][0]["data"].length == 0) {
                        returnData = {
                            code: "200",
                            data: [],
                        };
                    } else {
                        returnData = {
                            code: "200",
                            data: [data["data"][0]["data"], data["data"]],
                        };
                    }

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
    //深拷贝
    private dCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
}
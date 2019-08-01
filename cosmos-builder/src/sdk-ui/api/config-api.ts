import { ReportConfigService } from "../service/report-config.service";
import { Injectable } from "@angular/core";
import { EventEmitter } from "cosmos-td-sdk";
import { EventType } from "cosmos-td-sdk";
import { MOCK_DATA } from "../data/graph-data";
import { getGraphData } from "./graphdata-transform";
import { DataStore } from "cosmos-td-sdk";
import { DataStoreUtil, dataType } from "./data-store-util";

@Injectable()
export class ConfigApi {

    public scope: string;//当前图表的scopId
    public type: string;//当前图表的类型

    public linkageData: any;//联动的数据（外围组件传进的值）

    private cubeList: any = [];//cube列表

    constructor(public reportConfigService: ReportConfigService) {

    }

    /**
     * 获取参数列表
     */
    getGlobalParamList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.reportConfigService.queryGlobalParamList().then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        })
    }

    /**
     * 获取cube列表
     */
    getCubeList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.reportConfigService.queryMetaList().then(data => {
                if (data && data["total"] > 0) {
                    data = data["data"];
                    this.cubeList = [];
                    for (let i = 0; i < data.length; i++) {
                        this.cubeList.push({
                            value: data[i]["id"],
                            label: data[i]["name"]
                        });
                    }
                }
                resolve(this.cubeList);
            }).catch(err => {
                reject(err);
            });
        })
    }

    /**
     * 根据cubeId获取属性列表
     * @param cubeId
     */
    getAttributeByCubeId(cubeId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.reportConfigService.queryMetaAttr(cubeId).then(data => {
                resolve(data["data"]);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * 构建全局过滤器
     * @param data 
     */
    buildGlobalFilter(data: any) {
        let filters: any[] = [];
        data.forEach((filter: any) => {
            let str = {
                "type": "and",
                "condition": [
                    {
                        "field": filter["field"],
                        "operator": filter["operator"],
                        "value": filter["value"]
                    }
                ]
            }
            let val = this.getParamByName(filter["field"]);//链接上url上如果有这个参数，就以url上的为准
            if (val) {
                str.condition[0].value = val;
            }
            filters.push(str);
        });
        return filters;
    }

    /**
     * 根据传入的参数名称获取url上的参数值
     * @param name 
     */
    getParamByName(name: string) {
        var search = document.location.href;
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(search);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    };

    /**
     * 根据维度获取维度值
     * @param dimension 
     */
    queryDimensionValue(cube: number, dimension: string): Promise<any> {
        let param = {
            "cubeId": cube,
            "dimensions": [{
                "field": dimension
            }],
            "groupBy": [
                {
                    "field": dimension
                }
            ],
            "dictionary":true,
            "limit": {
                "page": 1,
                "pageSize": 1000
            }
        };
        //全局过滤器处理
        let globalData = DataStore.getGlobalData();
        if (globalData && globalData['filter']) {
            let globalFilters = this.buildGlobalFilter(globalData['filter']);
            if (!param["filters"]) {
                param["filters"] = [];
            }
            param["filters"] = param["filters"].concat(globalFilters);
        }
       return new Promise((resolve,reject)=> {
            this.reportConfigService.queryChartData([param]).then(data => {
                if (data && data["_body"]) {
                    data = JSON.parse(data["_body"]);
                    let list: any = [];
                    data["data"][0]["data"].forEach((element: any) => {
                        list.push({
                            label: element["dicItemValue"],
                            value: element["id"]
                        });
                    });
                    resolve(list);
                }
            })
            .catch(err => {
                // reject(err);
            });
       });
    }

    /**
     * 获取当前时间多少天之前的日期（不含今天）
     * @param day
     */
    getBeforeDate(day: number) {
        let nowDate = new Date().getTime();
        let range = 1000 * 60 * 60 * 24 * day;
        let beforeDate = this.formateDate(new Date(nowDate - range));

        return beforeDate;
    }

    /**
     * 格式化Date 为 “YYYY-MM-DD”
     * @param date 
     */
    formateDate(date: Date) {
        if ("string" == typeof (date)) {
            date = new Date(date);
        }
        let seperator1 = "-";
        let year = date.getFullYear();
        let month: any = date.getMonth() + 1;
        let strDate: any = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    /**
     * 过滤器过滤数据
     * @param arr 过滤器数据
     */
    filterData(arr: any) {
        let filters = [];
        for (let i = 0; i < arr.length; i++) {
            let andItem = {};
            andItem['type'] = "or";
            andItem['condition'] = [];
            for (let j = 0; j < arr[i].orArr.length; j++) {
                if (arr[i].orArr[j].option1 == "包含") {
                    if (arr[i].orArr[j].type == "input" || arr[i].orArr[j].type == "date" || arr[i].orArr[j].type == "checkcascader" || arr[i].orArr[j].type == "checkSelect" || arr[i].orArr[j].type == "cascader") {
                        let or = this.OrItem(arr[i].orArr[j].option2, arr[i].orArr[j].option3, arr[i].orArr[j].option4);
                        andItem['condition'].push(or)
                    } else if (arr[i].orArr[j].type == "twoInput") {
                        let orItem = {};
                        orItem['type'] = "and";
                        orItem['condition'] = [];
                        let or1 = this.OrItem(arr[i].orArr[j].option2, ">=", arr[i].orArr[j].option4[0].value);
                        let or2 = this.OrItem(arr[i].orArr[j].option2, "<=", arr[i].orArr[j].option4[1].value);
                        orItem['condition'].push(or1)
                        orItem['condition'].push(or2)
                        andItem['condition'].push(orItem)
                    } else if (arr[i].orArr[j].type == "manyInput") {
                        let option4 = arr[i].orArr[j].option4.split(",")
                        let or = this.OrItem(arr[i].orArr[j].option2, arr[i].orArr[j].option3, option4);
                        andItem['condition'].push(or)
                    } else if (arr[i].orArr[j].type == "twoDate") {
                        let orItem = {};
                        orItem['type'] = "and";
                        orItem['condition'] = [];
                        let or1 = this.OrItem(arr[i].orArr[j].option2, ">=", arr[i].orArr[j].option4[0]);
                        let or2 = this.OrItem(arr[i].orArr[j].option2, "<=", arr[i].orArr[j].option4[1]);
                        orItem['condition'].push(or1)
                        orItem['condition'].push(or2)
                        andItem['condition'].push(orItem)
                    }
                } else {
                    let orItem = {};
                    orItem['type'] = "not";
                    orItem['condition'] = [];
                    if (arr[i].orArr[j].type == "input" || arr[i].orArr[j].type == "date" || arr[i].orArr[j].type == "checkcascader" || arr[i].orArr[j].type == "checkSelect" || arr[i].orArr[j].type == "cascader") {
                        let or = this.OrItem(arr[i].orArr[j].option2, arr[i].orArr[j].option3, arr[i].orArr[j].option4);
                        orItem['condition'].push(or)
                    } else if (arr[i].orArr[j].type == "twoInput") {
                        let notandItem = {};
                        notandItem['type'] = "and";
                        notandItem['condition'] = [];
                        let or1 = this.OrItem(arr[i].orArr[j].option2, ">=", arr[i].orArr[j].option4[0].value);
                        let or2 = this.OrItem(arr[i].orArr[j].option2, "<=", arr[i].orArr[j].option4[1].value);
                        notandItem['condition'].push(or1)
                        notandItem['condition'].push(or2)
                        orItem['condition'].push(notandItem)
                    } else if (arr[i].orArr[j].type == "manyInput") {
                        let option4 = [];
                        option4.push(arr[i].orArr[j].option4)
                        let or = this.OrItem(arr[i].orArr[j].option2, arr[i].orArr[j].option3, option4);
                        orItem['condition'].push(or)
                    } else if (arr[i].orArr[j].type == "twoDate") {
                        let notDateAndItem = {};
                        notDateAndItem['type'] = "and";
                        notDateAndItem['condition'] = [];
                        let or1 = this.OrItem(arr[i].orArr[j].option2, ">=", arr[i].orArr[j].option4[0]);
                        let or2 = this.OrItem(arr[i].orArr[j].option2, "<=", arr[i].orArr[j].option4[1]);
                        notDateAndItem['condition'].push(or1)
                        notDateAndItem['condition'].push(or2)
                        orItem['condition'].push(notDateAndItem)
                    }
                    andItem['condition'].push(orItem)
                }
            }
            filters.push(andItem)
        }
        return filters;
    }

    // 拼接or
    OrItem(field: any, operator: any, value: any) {
        let orItem = {
            "field": field,
            "operator": operator,
            "value": value
        };
        return orItem;
    }
}

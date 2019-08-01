import { DataStoreUtil } from "../../../api/data-store-util";
import { DataStore, EventEmitter, EventType } from "cosmos-td-sdk";
import { ReportConfigService } from "../../../service/report-config.service";

export class BaseDataGraph {
    scopeId: any;
    constructor(
        public reportConfigService: ReportConfigService
    ) {

    }

    /**
     * 无数据面板时触发（回显或者过滤器触发）
     * @param obj 
     */
    queryChartData(obj: { queryParam: any, scope: string, linkageData: any, callback?: () => void }) {
        this.getChartData(obj.queryParam, obj.scope, obj.linkageData, obj.callback);
    }
    getChartData(queryChartParam: any, scope: string, linkageData?: any, callback?: () => void) {
        let param = this.beforeRequest(queryChartParam, scope, linkageData);
        if (!param) {
            return;
        }
        param = this.processFilterAndDate(param, queryChartParam, scope, linkageData);
        if (linkageData && linkageData.length > 0) {
            linkageData.forEach((element: any) => {
                if (element && element["filters"]) {
                    if (!param["filters"]) {
                        //需要判断
                        param["filters"] = [];
                    }
                    param["filters"].push(this.buildRequestDimensionValueFilter(element["filters"]));
                }
            });
        }
        // 条件筛选器处理
        if (linkageData && linkageData.length > 0) {
            linkageData.forEach((element: any) => {
                if (element && element["conditionFilters"]) {
                    this.coverFilter(element["conditionFilters"], param)
                }
            });
        }

        //日月周筛选器处理
        if (linkageData && linkageData.length > 0) {
            let linkLen = linkageData.length;
            for (let i = 0; i < linkLen; i++) {
                if (linkageData[i] && linkageData[i]["dayWeekMonth"]) {
                    param["interval"] = {
                        "field": "date",
                        "granularity": linkageData[i]["dayWeekMonth"]
                    }
                    break;
                }
            }
        }

        //全局过滤器处理
        let globalData = DataStore.getGlobalData();
        if (globalData && globalData["filter"]) {
            let globalFilters = this.buildGlobalFilter(globalData["filter"]);
            if (!param["filters"]) {
                param["filters"] = [];
            }
            param["filters"] = param["filters"].concat(globalFilters);
        }
        //下载
        if (linkageData && linkageData.length > 0) {
            let data = this.arrayMap(linkageData, 'down');
            let key: any = false;
            for (let j = 0; j < data.length; j++) {
                if (data[j] == "Yes") {
                    key = true;
                }
            }
            if (key) {
                linkageData.forEach((element: any) => {
                    if (element && element["scopeIdDown"]) {
                        this.Download(element["scopeIdDown"], param)
                        return this.Down(param, scope, callback);
                    }
                });
                key = false;
            } else {
                return this.doRequest(param, scope, callback);
            }
        } else {
            return this.doRequest(param, scope, callback);

        }
    }
    /**
     * 
     * @param arr 
     * @param key 
     */
    arrayMap(arr: any, key?: any) {
        return arr.map((item: any) => {
            if (item) {
                if (item[key] == "Yes") {
                    return item[key];
                }
            }
        });
    }
    /**
     * 发起请求
     * @param param 
     * @param scope 
     * @param callback 
     */
    doRequest(param: any, scope: string, callback: () => void) {
        setTimeout(() => {
            this.reportConfigService.queryChartData([param]).then(data => {
                if (data && data["_body"]) {
                    data = JSON.parse(data["_body"]);
                }
                let returnData = {
                    code: "200",
                    data: data["data"][0]["data"]
                };
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
    /**
     * 下载
     * @param param 
     * @param scope 
     * @param callback 
     */
    Down(param: any, scope: string, callback: () => void) {
        setTimeout(() => {
            delete (param["limit"]);
            if ((param && param["dimensions"] && param["dimensions"][0]) && (param && param["metrics"] && param["metrics"][0])) {
                param["dimensions"][0]["alias"] = param["dimensions"][0]["field"];
                param["metrics"][0]["alias"] = param["metrics"][0]["field"];
                if (param && param["columnToRow"] && param["columnToRow"][0]) {
                    param["columnToRow"][0]["field"] = param["metrics"][0]["alias"];
                }
                if (param && param["valueMapFormat"] && param["valueMapFormat"][0]) {
                    param["valueMapFormat"][0]["field"] = param["dimensions"][0]["alias"];
                }
                if (param && param["customOrders"] && param["customOrders"][0]) {
                    param["customOrders"][0]["field"] = param["dimensions"][0]["alias"];
                }
            }

            this.reportConfigService.queryDownloadData([param]).then(data => {
                if (data && data["_body"]) {
                    data = JSON.parse(data["_body"]);
                }
                let returnData = {
                    code: "200",
                    data: data['data'],
                };
                EventEmitter.trigger(EventType.DATACHANGE,
                    {
                        scope: this.scopeId,
                        data: returnData
                    }
                );

            }).catch(err => {
                EventEmitter.trigger(EventType.DATACHANGE,
                    {
                        scope: this.scopeId,
                        data: { data: '下载失败' }
                    }
                );
            });
        }, 0);
    }
    /**
     * 条件筛选器覆盖面板过滤器 会有查找相同
     * @param  
     */
    cond: boolean = false;
    coverFilter(conditionFilters: any, params: any) {
        if (params['filters'] && params['filters'].length > 0) {
            let deepFilters = this.deepCopy(params['filters']);
            let reference = this.deepCopy(params['filters']);
            if (deepFilters.length > 0) {
                for (let j = 0; j < deepFilters.length; j++) {
                    if (deepFilters[j].type == 'or') {
                        this.cond = true;
                    }
                }
                if (this.cond) {
                    this.cond = false;
                    if (conditionFilters[0]['type'] && conditionFilters[0]['type'] == "not") {
                        conditionFilters = [{
                            field: conditionFilters[0]["field"],
                            operator: 'in',
                            value: conditionFilters[0]["value"]
                        }];
                        for (let j = 0; j < deepFilters.length; j++) {
                            if (deepFilters[j].type == 'or') {
                                for (let k = 0; k < deepFilters[j].condition.length; k++) {
                                    if (deepFilters[j].condition[k].type == "not") {
                                        deepFilters[j] = this.loopFilters(params['filters'][j]["condition"], conditionFilters)
                                    }
                                }
                            }
                        }
                        if (JSON.stringify(deepFilters) == JSON.stringify(reference) && JSON.stringify(deepFilters) !== JSON.stringify(conditionFilters)) {
                            deepFilters = params['filters'];
                            return params['filters'].push({
                                type: 'not',
                                condition: conditionFilters
                            })
                        } else {
                            return params['filters'] = deepFilters
                        }
                    } else {
                        for (let j = 0; j < deepFilters.length; j++) {
                            if (params['filters'][j].type == 'or') {
                                for (let k = 0; k < deepFilters[j].condition.length; k++) {
                                    if (deepFilters[j].condition[k].type !== "not") {
                                        deepFilters[j] = this.loopFilters(params['filters'][j], conditionFilters)
                                    }
                                }
                            }
                        }
                        if (JSON.stringify(deepFilters) == JSON.stringify(reference) && JSON.stringify(deepFilters) !== JSON.stringify(conditionFilters)) {
                            params['filters'] = deepFilters;
                            return params['filters'].push({
                                type: 'and',
                                condition: conditionFilters
                            })
                        } else {
                            return params['filters'] = deepFilters
                        }
                    }
                } else {
                    deepFilters.push({
                        type: 'and',
                        condition: conditionFilters
                    })
                    return params['filters'] = deepFilters
                }
            } else {
                return params['filters'].push({
                    type: 'and',
                    condition: conditionFilters
                })
            }
        } else {
            return params['filters'] = [{
                type: 'and',
                condition: conditionFilters
            }]
        }
    }
    // 递归过滤器
    loopFilters(data: any, conditionFilters: any) {
        if (data.length == 1) {
            data = data[0]
        }
        for (let i = 0; i < data.condition.length; i++) {
            if (data.condition[0].field && data.condition[i].field == conditionFilters[0].field) {
                data.condition[i] = conditionFilters[0];
                return data;
            } else if (!data.condition[0].field && data.condition[0]) {
                this.loopFilters(data.condition[0], conditionFilters)
                // return data;
            }
            else {
                return data;
            }
        }
        return data;
    }
    //下载
    Download(conditionFilters: any, params: any) {
        this.scopeId = conditionFilters;
        params["limit"]["pageSize"] = '';
        return params;
    }

    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }

    /*
     * 处理过滤器和时间
     * @param param 
     * @param queryChartParam 
     * @param scope 
     * @param linkageData 
     */
    processFilterAndDate(param: any, queryChartParam: any, scope: string, linkageData?: any) {
        let filter = DataStoreUtil.getFilterData(scope, queryChartParam["cube"]);
        if (filter || queryChartParam["dateDimension"]) {
            if (!param["filters"]) {
                param["filters"] = [];
            }
            //处理过滤器的数据
            for (let key in filter) {
                param["filters"] = param["filters"].concat(this.filterData(filter[key]));
            }
            //处理日期范围
            if (queryChartParam["dateDimension"]) {
                let dateFilter = this.buildRequestFiltersDate(queryChartParam["dateDimension"], queryChartParam["dateType"], queryChartParam["dateRange"], linkageData);
                if (dateFilter) {
                    param["filters"].push(this.buildRequestFiltersDate(queryChartParam["dateDimension"], queryChartParam["dateType"], queryChartParam["dateRange"], linkageData));
                }
            }
        }
        return param;
    }

    /**
     * 发送请求前的处理
     * @param queryChartParam 
     * @param scope 
     * @param linkageData 
     */
    beforeRequest(queryChartParam: any, scope: string, linkageData?: any): Object {
        return {};
    }
    /**
     * 检查参数
     * @param queryChartParam 
     */
    checkQueryChartParam(queryChartParam: any, scope?: string) {

        if (!queryChartParam || !queryChartParam["cube"] || !queryChartParam["metrics"] || !queryChartParam["dimensions"]) {
            return false;
        }

        if (queryChartParam["dimensions"].length) {
            for (let i = 0; i < queryChartParam["dimensions"].length; i++) {
                if (!queryChartParam["dimensions"][i]["value"]) {
                    return false;
                }
            }
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
                "alias": i == 0 ? "X" : "Legend"
            }
            dimensions.push(dimension);
        }
        return dimensions;
    }

    /**
     * 过滤数据中重复数据
     * @param data 
     */
    distinctField(data: any[]) {
        let unique = {};
        data.forEach(gpa => {
            unique[JSON.stringify(gpa)] = gpa
        });
        data = Object.keys(unique).map(u => {
            return JSON.parse(u)
        });
        return data;
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
                    field = element["metrics"];
                }
            });
            if (field) {
                metrics.push({
                    "field": field,
                    "aggregator": "sum",//目前只支持sum 2018-03-15 20:21:01
                    "alias": "Y"
                });
                return metrics;
            }
        }
        data = this.distinctField(data);
        if (data && data.length == 1) {
            let metric = {
                "field": data[0]["value"],
                "aggregator": "sum",//目前只支持sum 2018-03-15 20:21:01
                "alias": "Y"
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

    /**
     * 构建后端请求需要的数据 groupBy
     * @param data
     */
    buildRequestGroupBy(data: any) {
        let groupBy = [];
        if (!data) {
            return
        }
        for (let i = 0; i < data.length; i++) {
            groupBy.push({
                "field": data[i]["value"]
            });
        }
        return groupBy;
    }

    /**
    * 构建排序字段
    * @param selectedOrderBy
    * @param selectedOrder
    */
    buildRequestOrderBy(queryChartParam: any, linkageData?: any) {
        if (queryChartParam['orderBy']) {
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
                    let hasMetric: boolean = false;
                    let order: any = null;
                    for (let i = 0; i < len; i++) {
                        if (this.checkDimensionHasField(queryChartParam['dimensions'], queryChartParam['orderBy'][i]['field'])) {
                            if (queryChartParam['orderBy'][i]["field"]) {
                                arr.push({
                                    field: queryChartParam['orderBy'][i]['field'],
                                    order: queryChartParam['orderBy'][i]['order']
                                });
                            }
                        } else {

                            if (!hasMetric) {
                                order = queryChartParam['orderBy'][i]['order'];
                            }
                            hasMetric = true;
                        }
                    }
                    if (hasMetric) {
                        arr.push({
                            field: field,
                            order: order
                        });
                    }

                }
            } else {
                for (let i = 0; i < queryChartParam['orderBy'].length; i++) {
                    if (queryChartParam['orderBy'][i]["field"]) {
                        arr.push({
                            field: queryChartParam['orderBy'][i]['field'],
                            order: queryChartParam['orderBy'][i]['order']
                        });
                    }
                }
            }
            return arr;
        }


    }

    /**
     * 检查排序字段中是否有外面传入的指标字段
     * @param orderBy 
     * @param metric 
     */
    checkOrderByHasMetric(orderBy: any, metric: any) {
        if (orderBy) {
            let len = orderBy.length;
            let hasMetric: boolean = false;
            for (let i = 0; i < len; i++) {
                if (metric == orderBy[i]['field']) {
                    hasMetric = true;
                    break;
                }
            }
            return hasMetric;
        }
    }

    /**
     * 检查外面传入的指标字段是否是维度
     * @param dimension 
     * @param field 
     */
    checkDimensionHasField(dimension: any, field: any) {
        if (dimension) {
            let len = dimension.length;
            let isDimension: boolean = false;
            for (let i = 0; i < len; i++) {
                if (field == dimension[i]['value']) {
                    isDimension = true;
                    break;
                }
            }
            return isDimension;
        }
    }
    /**
    * 多个指标时需要调用改方法拼接该字段
    * @param data 调用buildRequestMetrics方法返回的值
    */
    buildRequestColumnToRow(data: any) {
        let columnToRow: any = [];
        if (!data) {
            return
        }
        for (let i = 0; i < data.length; i++) {
            columnToRow.push({
                "field": data[i]["alias"],
                "rule": [
                    {
                        "convertField": "Legend",
                        "value": data[i]["field"]
                    },
                    {
                        "convertField": "Y",
                        "value": "${value}"
                    }
                ]
            });
        }
        return columnToRow;
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

    /**
     * 构建时间范围条件
     * @param dateColumn
     * @param dateType
     * @param dateRange
     */
    buildRequestFiltersDate(dateColumn: string, dateType: string, dateRange: any, linkageData: any) {
        if ("custom" == dateType && !dateRange) {
            return;
        }
        let filterDate = {
            "type": "and",
            "condition": [
                {
                    "field": dateColumn,
                    "operator": ">=",
                    "value": dateType == "default" ? this.getBeforeDate(28) : this.formateDate(dateRange[0])
                },
                {
                    "field": dateColumn,
                    "operator": "<=",
                    "value": dateType == "default" ? this.getBeforeDate(1) : this.formateDate(dateRange[1])
                }
            ]
        };
        if (linkageData && linkageData.length > 0) { //外围组件指标筛选
            let time = "";
            linkageData.forEach((element: any) => {
                if (element && element["dateRange"]) {
                    time = element["dateRange"];
                }
            });
            if (time && time.length == 2) {
                filterDate.condition[0].value = time[0];
                filterDate.condition[1].value = time[1];
            }
        }
        return filterDate;
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
     * 构建漏斗步骤数据
     * @param dimensionParam 
     * @param data 
     */
    buildRequestValueMapFormat(dimensionParam: any, data: any) {
        let rules: any = []
        let valueMapFormat = [{
            "field": dimensionParam[0]["alias"],
            "rule": rules
        }];
        for (let key in data) {
            let arr = data[key];
            for (let i = 0; i < arr.length; i++) {
                rules.push({
                    "convertCondition": arr[i]["gist"],
                    "convertValue": arr[i]["name"] ? arr[i]["name"] : arr[i]["gist"],
                    "convertId": arr[i]["id"],
                });
            }
        }

        return valueMapFormat;
    }

    /**
     * 构建漏斗步骤顺序
     * @param dimensionParam 
     * @param data 
     */
    buildRequestCustomOrders(dimensionParam: any, data: any) {
        let rules: any = []
        let customOrders = [{
            "field": dimensionParam[0]["alias"],
            "valueOrder": rules
        }];
        for (let key in data) {
            let arr = data[key];
            for (let i = 0; i < arr.length; i++) {
                if (dimensionParam[0]["field"] == "时间" || dimensionParam[0]["field"] == "date") {
                    var reg = new RegExp("-", "g");
                    rules.push(arr[i]["name"] == "" ? arr[i]["gist"].replace(reg, "") : arr[i]["name"].replace(reg, ""));
                } else {
                    rules.push(arr[i]["name"] == "" ? arr[i]["gist"] : arr[i]["name"]);
                }
            }
        }

        return customOrders;
    }

    /**
     * 构建漏斗步骤数据时（默认）添加的过滤
     * @param data 
     */
    buildRequestFunnelFilter(data: any) {
        let funnelFilter: any = {
            "type": "and",
            "condition": [
                {
                    "field": "",
                    "operator": "in",
                    "value": []
                }
            ]
        };
        for (let key in data) {
            let arr = data[key];
            funnelFilter["condition"][0]["field"] = key;
            for (let i = 0; i < arr.length; i++) {
                funnelFilter["condition"][0]["value"].push(arr[i]["id"]);
            }
        }
        return funnelFilter;
    }

    /**
     * 构建选择维度值时添加的过滤
     * @param data 
     */
    buildRequestDimensionValueFilter(data: any) {
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
        //处理其他
        if (data["dimensionValueData"]) {
            let values = (data["dimensionValueData"] + "").split(",");
            if (values.length > 1) {
                dimensionValueFilter["type"] = "not";
            }
            values.forEach((value: any) => {
                dimensionValueFilter["condition"][0]["value"].push(value);
            });
        }
        return dimensionValueFilter;
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
}
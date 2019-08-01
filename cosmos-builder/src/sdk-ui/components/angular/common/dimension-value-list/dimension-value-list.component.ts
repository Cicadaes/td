import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { filterFixedService } from '../../../../../app/main/reportconfig/report/report-detail/filter-fixed/filter-fixed.service';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { Subscription } from 'rxjs/Subscription';
import { ReportConfigService } from '../../../../../sdk-ui/service/report-config.service';
import { DataStoreUtil, dataType } from '../../../../api/data-store-util';
import { BaseDataGraph } from '../base-data.graph';
@Component({
    selector: 'dimension-value-list',
    templateUrl: './dimension-value-list.component.html',
    styleUrls: ['./dimension-value-list.component.less'],
    providers: [ReportConfigService]
})

export class DimensionValueListComponent implements OnInit {

    isDisabled: boolean = true;//保存按钮是否好用

    allChecked = true; //全选
    indeterminate = false; //全选样式控制

    checkOptionsOne: any = [];//维度值列表
    selectedDimension: any;//选中的维度

    metricsList: any = [];//指标列表
    selectMetrics: string = "";//选中的指标

    type: string = "";//维度值顺序   自定义or 按顺序

    valueOrderByList: any = [];//维度值排序方式
    selecedOrderBy: string = "";//选中的维度值排序方式

    orderList: any = [
        { value: 'asc', label: '升序' },
        { value: 'desc', label: '降序' }
    ];//排序方式
    selectOrder: string = "";//选中的排序方式
    count: number;//查询维度值的个数

    isShowOther: boolean = false;//是否显示其他

    _showWhole: boolean = false;
    _showOther: boolean = false;

    @Input() cube: number;//所选的cube

    @Input()
    set dimension(dimension: any) {
        if (!dimension) {
            return;
        }
        this.selectedDimension = dimension;
        let config = DataStoreUtil.getDataFromConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA);
        if (config) {
            this.isDisabled = false;
            this.type = config["type"];
            if (!config["orderBy"]) {
                this.selecedOrderBy = "";
            } else if (this.selectedDimension == config["orderBy"]) {
                this.selecedOrderBy = "dimensionValue";
            } else {
                this.selecedOrderBy = "metric";
                this.selectMetrics = config["orderBy"];
            }
            this.selectOrder = config["order"];
            this.count = config["count"];
            this.checkOptionsOne = config["options"];
            this.isShowOther = config["showOther"];
        } else {
            this.isDisabled = true;
            this.type = "";
            this.selectMetrics = "";
            this.selecedOrderBy = "";
            this.selectOrder = "";
            this.count = null;
            this.checkOptionsOne = [];
        }
    }

    @Input()
    set metrics(metricsList: any) {
        this.metricsList = metricsList;
    }

    @Input()
    set showWhole(showWhole: any) {
        this._showWhole = showWhole;
    }

    @Input()
    set showOther(showOther: any) {
        this._showOther = showOther;
    }

    @Output() closeDimension = new EventEmitter<any>();//关闭维度值列表

    @Output() changeDimensionValue = new EventEmitter<any>();//改变选中

    constructor(
        private reportConfigService: ReportConfigService,
        public configApi: ConfigApi,
    ) {
        this.valueOrderByList = [
            { value: "dimensionValue", label: "维度值首字母" },
            { value: "metric", label: "指标" }
        ]
    }

    ngOnInit() {

    }

    /**
     * 获取维度值
     */
    queryDimensionValue() {
        //校验
        if ("order" == this.type) {
            if (!this.selecedOrderBy || !this.selectOrder || !this.count) {
                this.isDisabled = true;
                return;
            }
            if ("metric" == this.selecedOrderBy && !this.selectMetrics) {
                this.isDisabled = true;
                return;
            }
        }
        let param = {
            "cubeId": this.cube,
            "dimensions": [{
                "field": this.selectedDimension
            }],
            "groupBy": [
                {
                    "field": this.selectedDimension
                }
            ],
            "dictionary": true,
            "wholeValue": false,//全部
            "other": true,
            "limit": {
                "page": 1,
                "pageSize": 1000
            }
        };

        param['wholeValue'] = this._showWhole;
        param['other'] = this._showOther;
        param['other'] = this.isShowOther;

        if ("order" == this.type) {
            if (this.count) {
                param["limit"]["pageSize"] = this.count;
            }
            if (this.selecedOrderBy && this.selectOrder) {
                let field = "";
                if (this.selecedOrderBy == "metric" && this.selectMetrics) {
                    param["metrics"] = [{
                        "field": this.selectMetrics,
                        "aggregator": "sum",
                        "alias": this.selectMetrics
                    }]
                    field = this.selectMetrics;
                } else if (this.selecedOrderBy == "dimensionValue") {
                    field = this.selectedDimension;
                } else {
                    return;
                }
                param["orderBy"] = [
                    {
                        "field": field,
                        "order": this.selectOrder
                    }
                ]
            }
        }
        let filter = DataStoreUtil.getFilterData(this.configApi.scope, this.cube);
        if (filter) {
            param["filters"] = [];
            //处理过滤器的数据
            for (let key in filter) {
                param["filters"] = param["filters"].concat(this.configApi.filterData(filter[key]));
            }
        }
        //全局过滤器处理
        let globalData = DataStore.getGlobalData();
        if (globalData && globalData["filter"]) {
            let globalFilters = new BaseDataGraph(this.reportConfigService).buildGlobalFilter(globalData["filter"]);
            if (!param["filters"]) {
                param["filters"] = [];
            }
            param["filters"] = param["filters"].concat(globalFilters);
        }

        this.isDisabled = false;
        this.reportConfigService.queryChartData([param]).then(data => {
            this.checkOptionsOne = [];
            if (data && data["_body"]) {
                data = JSON.parse(data["_body"]);
                data = data["data"][0]["data"]
                if (data && data.length > 0) {
                    data.forEach((item: any) => {
                        this.checkOptionsOne.push({
                            label: item["dicItemValue"],
                            value: item["id"],
                            checked: true
                        });
                    });
                }
            }
        }).then(data => {
            // DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA, this.buildDimensionSetting());
        }).catch(err => {

        });
    }

    /**
     * 检查提交按钮是否可用
     */
    checkSubmitButton() {
        if ("order" == this.type) {
            if (!this.selecedOrderBy || !this.selectOrder || !this.count) {
                this.isDisabled = true;
            }
            if ("metric" == this.selecedOrderBy && !this.selectMetrics) {
                this.isDisabled = true;
            }
        } else if ("auto" == this.type) {
            this.isDisabled = false;
        }
    }

    /**
     * 触发全选
     */
    updateAllChecked() {
        this.indeterminate = false;
        if (this.allChecked) {
            this.checkOptionsOne.forEach((item: any) => item.checked = true);
            this.isDisabled = false;
        } else {
            this.checkOptionsOne.forEach((item: any) => item.checked = false);
            this.isDisabled = true;
        }
        // this.changeDimensionValue.emit(this.checkOptionsOne);
    }

    /**
     * 触发单选
     */
    updateSingleChecked() {
        if (this.checkOptionsOne.every((item: any) => item.checked === false)) {
            this.allChecked = false;
            this.indeterminate = false;
            this.isDisabled = true;
        } else if (this.checkOptionsOne.every((item: any) => item.checked === true)) {
            this.allChecked = true;
            this.indeterminate = false;
            this.isDisabled = false;
        } else {
            this.indeterminate = true;
            this.isDisabled = false;
        }
        // this.changeDimensionValue.emit(this.checkOptionsOne);
    }

    /**
     * 关闭维度值列表
     */
    closeDimensionValues() {
        this.closeDimension.emit(false);
    }

    /**
     * 改变维度值展示方式
     * @param value 
     */
    changeType(value: any) {
        this.allChecked = true;
        this.indeterminate = false;
        this.checkOptionsOne && this.checkOptionsOne.forEach((item: any) => item.checked = true);
        // if ("auto" != value) {
        //     DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA, this.buildDimensionSetting());
        // }
        this.queryDimensionValue();
        this.checkSubmitButton();
    }

    /**
     * 保存维度值配置
     */
    saveValueSet(data?: any) {
        DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.DIMENSIONVALUEDATA, this.buildDimensionSetting());
        this.changeDimensionValue.emit(this.checkOptionsOne);
        this.closeDimension.emit(false);
    }

    /**
     * 改变排序字段
     * @param value 
     */
    changeOrderBy(value: any) {
        this.queryDimensionValue();
    }

    /**
     * 改变排序方式
     * @param value 
     */
    changeOrder(value: any) {
        this.queryDimensionValue();
    }

    /**
     * 改变取前多少维度值
     * @param value 
     */
    changeCount(value: any) {
        // if (/^[1-9]\d*$/.test(this.count + '')) {
        //     this.queryDimensionValue();
        //     this.isDisabled = false;
        // }
        if (!this.count && this.count !== 0) {
            this.isDisabled = true;
        } else if (/^[1-9]\d*$/.test(this.count + '')) {
            this.queryDimensionValue();
        } else {
            this.count = 1;
            this.isDisabled = false;
        }
    }

    /**
     * 改变显示其他
     * @param value 
     */
    changeShowOther(value: any) {
        this.queryDimensionValue();
    }

    inputNumberChange() {
        if (!this.count && this.count !== 0) {
            this.isDisabled = true;
        } else if (/^[1-9]\d*$/.test(this.count + '')) {
            this.queryDimensionValue();
            this.isDisabled = false;
        } else {
            this.count = 1;
            this.isDisabled = false;
        }
    }

    /**
     * 改变指标
     * @param value 
     */
    changeMetrics(value: any) {
        this.queryDimensionValue();
    }

    /**
     * 构建维度值的设置
     */
    buildDimensionSetting() {
        let setData = {
            "type": this.type
        };
        if ("auto" == this.type) {
            setData["options"] = this.checkOptionsOne;//维度值
        } else if ("order" == this.type) {
            setData["count"] = this.count;//维度值个数
            setData["order"] = this.selectOrder;//排序方式
            setData["showOther"] = this.isShowOther;//展示其他
            if ("dimensionValue" == this.selecedOrderBy) {
                setData["orderBy"] = this.selectedDimension;//排序字段
            } else if ("metric" == this.selecedOrderBy) {
                setData["orderBy"] = this.selectMetrics;
            }
            setData["options"] = this.checkOptionsOne;
        }
        return setData;
    }
}
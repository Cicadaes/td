import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType, ComponentEvent, DomEvent, DataStore } from "cosmos-td-sdk";
import { SelectGraph } from './select.graph';
import { ReportConfigService } from '../../../../sdk-ui/service/report-config.service';
import { BaseDataGraph } from '../common/base-data.graph';
import { DataStoreUtil, dataType } from '../../../api/data-store-util';
import { ConfigApi } from '../../.../../../api/config-api';

@Component({
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.less'],
    providers: [ReportConfigService]
})

export class SelectComponent extends Communication implements OnInit, OnDestroy {
    private selectedCube: any;
    private alignStyle: any = {};
    private scopeId: any;
    private transfer: any; //传递值

    public option: SelectGraph = new SelectGraph();
    private dataObj: any = {
        data: {},
        style: {}
    };

    constructor(
        private reportConfigService: ReportConfigService,
        private changeDetectorRef: ChangeDetectorRef,
        public configApi: ConfigApi,
    ) {
        super();
    }

    ngOnInit() {

    }

    public onDataChange(scope: string, data: any) {
        this.scopeId = scope;
        this.dataObj.data = data[0];
        this.option = new SelectGraph(this.dataObj);
        // console.log(this.option)
        setTimeout(() => {
            this.onIng(this.scopeId, this.dataObj)
            if (this.option.data.List.length) {
                this.selectedCube = this.option.data.dimensionDefault;
            } else {
                this.option.data.List = [{ label: "请选择", value: '' }];
                this.option.data.dimensionDefault = '';
                this.selectedCube = this.option.data.dimensionDefault;
            }

            this.changeModel(this.selectedCube, false);
        }, 300);

        DomEvent.fireEvent(this.selectFilter.nativeElement, ComponentEvent.COMFILTERCHANGE,
            {
                data: {
                    "filters": {
                        dimension: this.option.data.dimension,
                        dimensionValueData: this.option.data.dimensionDefault
                    }
                },
                bubble: false
            });
        // this.changeDetectorRef.markForCheck();
        // this.changeDetectorRef.detectChanges();

    }
    onIng(data: any, cont?: any) {
        let config = DataStore.getConfigData(data);
        if (config && config["dataConfig"] && config["dataConfig"]["dimensionValueData"]) {
            let param: any;
            if (config["dataConfig"]["dimensionValueData"] && config["dataConfig"]["dimensionValueData"]) {
                this.transfer = config["dataConfig"]["dimensionValueData"]['options']
            }
            if (config["dataConfig"]["dimensionValueData"] && config["dataConfig"]["dimensionValueData"]['type'] == 'auto') {
                param = {
                    "cubeId": config["dataConfig"]["cube"],
                    "dimensions": [
                        {
                            "field": config["dataConfig"]["dimension"]
                        }
                    ],
                    "groupBy": [
                        {
                            "field": config["dataConfig"]["dimension"]
                        }
                    ],
                    "dictionary": true,//数据自典
                    "wholeValue": true,//全部
                    "other": false,
                    "limit": {
                        "page": 1,
                        "pageSize": 1000
                    },
                    "filters": [

                    ]
                }
            } else if (config["dataConfig"]["dimensionValueData"] && config["dataConfig"]["dimensionValueData"]['type'] == 'order') {
                param = {
                    "cubeId": config["dataConfig"]["cube"],
                    "dimensions": [
                        {
                            "field": config["dataConfig"]["dimension"]
                        }
                    ],
                    "groupBy": [
                        {
                            "field": config["dataConfig"]["dimension"]
                        }
                    ],
                    "dictionary": true,     //??????
                    "wholeValue": true,     //??????
                    "other": config["dataConfig"]["dimensionValueData"]["showOther"],
                    "limit": {
                        "page": 1,
                        "pageSize": config["dataConfig"]["dimensionValueData"]["count"]
                    },
                    "orderBy": [
                        {
                            "field": config["dataConfig"]["dimensionValueData"]['orderBy'],
                            "order": config["dataConfig"]["dimensionValueData"]["order"]
                        }
                    ],
                    "filters": [

                    ]
                };
                if (config["dataConfig"]["dimensionValueData"] && config["dataConfig"]["dimension"] !== config["dataConfig"]["dimensionValueData"]['orderBy']) {
                    param["metrics"] = [{
                        "field": config["dataConfig"]["dimensionValueData"]['orderBy'],
                        "aggregator": "sum",
                        "alias": config["dataConfig"]["dimensionValueData"]['orderBy']
                    }]
                }
            }
            // //全局过滤器处理
            // let globalData = DataStore.getGlobalData() && DataStore.getGlobalData()["filter"];
            // let content: any, conditions: any = [];

            // if (globalData && globalData.length) {
            //     globalData.forEach((item: any) => {
            //         let field: any;
            //         field = this.getParamByName(item["field"])
            //         if (field) {
            //             conditions.push({ "field": item["field"], "operator": item["operator"], "value": field })
            //         } else {
            //             conditions.push({ "field": item["field"], "operator": item["operator"], "value": item["value"] })
            //         }
            //     })

            //     content = [{ "type": "and", "condition": conditions }];

            // } else {
            //     content = [];
            // }
            // param["filters"] = param["filters"] = content;

            //////////////////////
            let filter = DataStoreUtil.getFilterData(this.configApi.scope, config["dataConfig"]["cube"]);
            if (filter) {
                param["filters"] = [];
                //处理过滤器的数据
                for (let key in filter) {
                    param["filters"] = param["filters"].concat(this.configApi.filterData(filter[key]));
                }
            }
            // //全局过滤器处理
            let globalData = DataStore.getGlobalData();
            if (globalData && globalData["filter"]) {
                let globalFilters = new BaseDataGraph(this.reportConfigService).buildGlobalFilter(globalData["filter"]);
                if (!param["filters"]) {
                    param["filters"] = [];
                }
                param["filters"] = param["filters"].concat(globalFilters);
            }
            let checkOptionsOne: any;
            this.reportConfigService.queryChartData([param]).then((cont: any) => {
                this.option.data.List = [];
                if (cont && cont["_body"]) {
                    cont = JSON.parse(cont["_body"]);
                    cont = cont["data"][0]["data"]
                    if (cont && cont.length > 0) {
                        if (this.transfer) {
                            cont.splice(0, this.transfer.length)
                            cont = this.transfer.concat(cont)
                        }
                        cont.forEach((item: any) => {
                            if (item['checked']) {
                                this.option.data.List.push({
                                    label: item["label"],
                                    value: item["value"],
                                    checked: item["checked"]
                                });
                            }
                        });
                    }
                }
            }).catch(err => {
            });
        }
    }
    public onStyleChange(scope: string, data: any) {
        this.scopeId = scope;
        let alignment = data.alignment;
        if (alignment == 'left') {
            this.alignStyle = { 'float': 'left' }
        }
        if (alignment == 'right') {
            this.alignStyle = { 'float': 'right' }
        }
        if (alignment == 'center') {
            // this.alignStyle = { 'float': 'none', 'margin': 'auto' }
            this.alignStyle = { 'float': 'none', 'text-align': 'center' }

        }
    }

    public onSizeChange() {

    }

    public onVisualArea(scope: string) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope });
    }

    @ViewChild('selectFilter') selectFilter: any;

    private changeModel(value: any, bubble?: boolean) {
        DomEvent.fireEvent(this.selectFilter.nativeElement, ComponentEvent.COMFILTERCHANGE,
            {
                data: {
                    "filters": {
                        dimension: this.option.data.dimension,
                        dimensionValueData: value
                    }
                },
                bubble: bubble
            });
    }

    ngOnDestroy() {

    }

    /**
    * 获取URL
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

/**
 * Created by zhaoxue on 2017-09-11.
 */
import * as $ from 'jquery';
import {EventEmitter} from "./events/emitter.event";
import {EventType} from "./events/type.event";

export class EventBroker {
    private stageData: any = null;

    public stageDataArray: Array<any> = [];
    public stageFilterComponent: Array<any> = [];
    private targetTopLevelFilter: boolean = false;

    constructor() {
        EventEmitter.register(EventType.COMONCHANGE, this.onChange, this);
        EventEmitter.register(EventType.COMONFILTERCHANGE, this.onFilterChange, this);
        EventEmitter.register(EventType.SEND_MESSAGE, this.sendMessage, this);
    }

    public removeRegister() {
        this.stageFilterComponent = [];
        EventEmitter.restoreListeners();
        EventEmitter.register(EventType.COMONCHANGE, this.onChange, this);
        EventEmitter.register(EventType.COMONFILTERCHANGE, this.onFilterChange, this);
        EventEmitter.register(EventType.SEND_MESSAGE, this.sendMessage, this);
    }

    public initData(data: any) {
        this.stageData = data.components;
    }

    //判断
    public onChange(event: any, target: any, changeObj: any) {
        if (changeObj.scopeID == target.scopeID) {
            (function (self) {
                self.postSettingData(target, changeObj);
            })(this);
        }
    }

    //判断
    public sendMessage(event: any, changeObj: any) {
        let filterObj: any = changeObj['filterObj'];
        for (let key in filterObj) {
            if (key == 'chartScopeID') {
                EventEmitter.trigger(EventType.FILTERCHANGE,
                    {
                        scopeID: changeObj.scopeID,
                        result: changeObj.result,
                        chartScopeId: filterObj[key],
                        stageFilter: this.stageFilterComponent
                    });
            }
            if (key == 'message') {
                EventEmitter.trigger(EventType.MESSAGE_CHANGE,
                    {
                        target: filterObj[key],
                        result: changeObj.result
                    });
            }
        }
    }

    //合并filter数据
    public onFilterChange(event: any, chart: any, target: any) {
        let saveFilterArray: Array<any> = [],
            filterBool: boolean = false;
        //判断顶级的过滤器是否为true
        this.decideFilterBool();

        for (let j of target.filterScopeIDObj.chartScopeID) {
            if (j == chart.scopeID) {
                //设置时间
                chart.mergeDateObj = target.mergeDateObj;
                //设置过滤器
                if (target.mergeFilterObj !== null && target.mergeFilterObj['filter'] !== null) {
                    if (chart.mergeFilterObj == null || target.rfmChart) {
                        chart.mergeFilterObj = target.mergeFilterObj;
                    } else {
                        for (let t of chart.mergeFilterObj['filter']) {
                            for (let p of target.mergeFilterObj['filter']) {
                                if (t.field == p.field && t.value !== p.value) {
                                    t.value = p.value
                                }
                                saveFilterArray.push(p);
                            }
                        }
                        filterBool = true;
                    }
                }
            }

        }

        if (filterBool) {
            chart.mergeFilterObj['filter'] = this.compareFilterArray(saveFilterArray);
        }

        if (this.targetTopLevelFilter) {
            EventEmitter.trigger(EventType.FILTERCHANGE,
                {
                    scopeID: chart.scopeID,
                    result: this.mergeFilterResult(chart),
                    filterChange: true
                });
        }

    }

    private decideFilterBool() {
        if (this.stageFilterComponent.length > 0) {
            for (let item of this.stageFilterComponent) {
                if (item.topLevelFilter) {
                    this.targetTopLevelFilter = true;
                }
            }
        }
    }

    private mergeFilterResult(target: any) {
        let mergeFilter: any;
        if (target.mergeDateObj !== null && target.mergeFilterObj !== null) {
            mergeFilter = Object.assign(target.mergeDateObj, target.mergeFilterObj);
        } else if (target.mergeDateObj !== null) {
            mergeFilter = target.mergeDateObj;
        } else if (target.mergeFilterObj !== null) {
            mergeFilter = target.mergeFilterObj;
        }
        return mergeFilter;
    }

    private decideFilterScopeID(arr: Array<any>, scopeId: any) {
        if (arr.length > 0) {
            for (let i = 0, j = arr.length; i < j; i++) {
                if (arr[i] == scopeId) {
                    arr.splice(i, 1)
                }
            }
        }
        return arr;
    }

    private compareFilterArray(saveFilterArray: Array<any>) {
        var ret = [];

        for (var i = 0, j = saveFilterArray.length; i < j; i++) {
            if (ret.indexOf(saveFilterArray[i]) === -1) {
                ret.push(saveFilterArray[i]);
            }
        }
        return ret;
    }

    //对应成功发送post请求成功后返回数据
    public postSettingData(target: any, changeObj: any) {
        let url_host = "/wreport_datareport";
        let _self = this;

        switch (target.downloadBoolean) {
            case false :
                $.ajax({
                    //开发地址
                    url: url_host + '/report/dataSources/id/data',
                    dataType: 'JSON',
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(changeObj.result),
                    success: function (data: any) {
                        $("#" + target.scopeID).find(".before_loading").remove();
                        EventEmitter.trigger(EventType.DATACHANGE,
                            {
                                scopeID: target.scopeID,
                                result: data
                            });
                    },
                    error: function (data: any) {
                        // alert('请求失败' + data)
                    },
                    beforeSend: function () {
                        if (target.filterScopeIDObj) {
                            return;
                        } else {
                            let loadding = "";
                            loadding += '<div class="before_loading">' +
                                '<div class="loadEffect">' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '<span></span>' +
                                '</div>' +
                                '</div>'
                            $("#" + target.scopeID).append(loadding)
                        }
                        // alert('正在加载中...');
                    }
                })
                break;
            case true :
                $.ajax({
                    //开发地址
                    url: url_host + '/report/dataSources/id/data/downloadExcel',
                    dataType: 'JSON',
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(changeObj.result),
                    success: function (data: any) {
                        window.open(url_host + "/" + data)
                    },
                    error: function (data: any) {
                        // alert('请求失败' + data)
                    },
                })
                break;
        }

    }

}
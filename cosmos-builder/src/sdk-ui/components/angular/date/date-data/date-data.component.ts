import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { DataStoreUtil, dataType } from "./../../../../api/data-store-util";

@Component({
    templateUrl: './date-data.component.html',
    styleUrls: ['./date-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class DateDataComponent implements OnInit {
    _cmShortcutDate: object
    link: any;
    _dateRange: any;
    date: any;
    keys: boolean = true;
    startime: any;
    endtime: any;
    _cmFormate: string = "YYYY-MM-DD";
    subscript: any;//下标
    name: any = "日期";
    constructor(
        public configApi: ConfigApi
    ) {
    }
    typefaces = [
        {
            value: 2,
            label: "最近3天"
        },
        {
            value: 6,
            label: "最近7天"
        },
        {
            value: 29,
            label: "最近30天"
        },
        {
            value: 0,
            label: "自定义最近N天"
        }
    ];
    _disabledDate(current: Date): any {
        if (current) {
            // if ((Date.now() - current.getTime() > 0) && (current.getTime() - (Date.now() - 365 * 24 * 60 * 60 * 1000) > 0)) {
            //     return false;
            // } else {
            //     return true;
            // }
            if ((Date.now() - current.getTime() > 0)) {
                return false;
            } else {
                return true;
            }
        }
    };

    async ngOnInit() {
        let config = DataStore.getConfigData(this.configApi.scope);
        if (config && config["dataConfig"]) {
            this.date = config["dataConfig"];
            this.name = this.date['name']
            if (this.date["value"].length > 1) {
                if (this.date["direction"] == "minus") {
                    let now = new Date();
                    this.endtime = new Date(now.getTime() - this.date["value"][1] * 24 * 60 * 60 * 1000);
                    this.startime = new Date(this.endtime.getTime() - this.date["value"][0] * 24 * 60 * 60 * 1000);
                    if (this.date["value"][0] == 0 && this.date["value"][0] == 0) {
                        this.date = {
                            days: this.typefaces[3].value,
                            date: [this.startime, this.endtime]
                        }
                    }

                }
                if (this.date["direction"] == "add") {
                    let now = new Date();
                    this.startime = new Date(now.getTime() + this.date["value"][1] * 24 * 60 * 60 * 1000);
                    this.endtime = new Date(this.startime.getTime() + this.date["value"][0] * 24 * 60 * 60 * 1000);
                }
                if (this.date["direction"] == "both") {
                    let now = new Date();
                    this.startime = new Date(now.getTime() - this.date["value"][0] * 24 * 60 * 60 * 1000);;
                    this.endtime = new Date(now.getTime() + this.date["value"][1] * 24 * 60 * 60 * 1000);
                }
                this.date = {
                    days: this.typefaces[3].value,
                    date: [this.startime, this.endtime],
                    name: this.name,
                }
            } else {
                if (this.date["direction"] == "minus") {
                    let now = new Date();
                    this.startime = new Date(now.getTime() - this.date["value"] * 24 * 60 * 60 * 1000);
                    this.endtime = now;
                    if (this.date["value"] == 2) {
                        this.subscript = 0;
                    }
                    if (this.date["value"] == 6) {
                        this.subscript = 1;
                    }
                    if (this.date["value"] == 29) {
                        this.subscript = 2;
                    }
                }
                this.date = {
                    days: this.typefaces[this.subscript].value,
                    date: [this.startime, this.endtime],
                    name: this.name,
                }
                this.keys = false;
            }
        } else {

            this.date = {
                days: this.typefaces[3].value,
                date: [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()],
                name: this.name,
            }
            this.link = {
                direction: "minus",
                value: [6],
                name: this.name,
            };
            this.saveconfig(this.link);
            this.keys = true;
        }
    }

    changeDateRange(data: any) {
        if (data.constructor !== Array) {
            if (this.link) {
                this.link['name'] = this.name;
            }
            else {
                let config = DataStore.getConfigData(this.configApi.scope);
                this.link = {
                    direction: config["dataConfig"]["direction"],
                    value: config["dataConfig"]["value"],
                    name: this.name,
                };
            }
        } else {
            let now = new Date();                           //现在
            if (data[1] < now && data[0] < now) {
                this.link = {
                    direction: "minus",
                    value: [this.timediff(data[0], data[1]), this.timediff(data[1], now)],
                    name: this.name,
                }
            }
            if (data[0] > now && data[1] > now) {
                this.link = {
                    direction: "add",
                    value: [this.timediff(data[0], data[1]), this.timediff(now, data[0])],
                    name: this.name,
                }
            }
            if (data[0] < now && data[1] > now) {
                this.link = {
                    direction: "both",
                    value: [this.timediff(data[0], now), this.timediff(now, data[1])],
                    name: this.name,
                }
            }
        }

        // this.saveconfig(this.link)
        setTimeout(() => {
            this.saveconfig(this.link)
        }, 0);
    }


    OptionChange(data: any) {
        if (data !== 0) {
            this.keys = false;
            let now = new Date();                           //现在
            this.link = {
                direction: "minus",
                value: [data],
                name: this.name,
            };
            // this.saveconfig(this.link);
            setTimeout(() => {
                this.saveconfig(this.link)
            }, 0);
        } else {
            this.keys = true;
            this.date = {
                days: this.typefaces[3].value,
                date: [new Date(), new Date()],
                name: this.name,
            }
            this.link = {
                direction: "minus",
                value: [0, 0],
                name: this.name,
            };
            // this.saveconfig(this.link);
            setTimeout(() => {
                this.saveconfig(this.link)
            }, 0);
        }


    }
    /**
     * 保存
     */
    saveconfig(data: any) {
        DataStore.saveConfigData(this.configApi.scope, "dataConfig", data);
        let config = DataStore.getConfigData(this.configApi.scope);
        EventEmitter.trigger(EventType.DATACHANGE,
            {
                scope: this.configApi.scope,
                data: {
                    code: "200",
                    data: [data]
                }
            }
        );
    }
    /**
     * 时间差
     * @param  
     * @param  
     */
    private timediff($begin_time: any, $end_time: any) {
        let $starttime, $endtime;
        if ($begin_time < $end_time) {
            $starttime = $begin_time;
            $endtime = $end_time;
        } else {
            $starttime = $end_time;
            $endtime = $begin_time;
        }
        //计算天数  
        let $timediff = $endtime - $starttime;
        let $days = $timediff / 86400000;
        return $days;
    }
    /**
     * 时间加一天
     * @param startDate 
     */
    private dateAdd(startDate: any) {
        startDate = new Date(startDate);
        startDate = +startDate + 1000 * 60 * 60 * 24;
        startDate = new Date(startDate);
        var nextStartDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
        return nextStartDate;
    }
}


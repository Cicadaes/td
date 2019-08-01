import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';
import { DataStore } from 'cosmos-td-sdk';

@Component({
    templateUrl: './dayWeekMonth-style.component.html',
    styleUrls: ['./dayWeekMonth-style.component.less'],
})
export class DayWeekMonthStyleComponent extends StylePanel implements OnInit {
    checkOptions: any = [
        { value: 'day', label: '日', checked: true },
        { value: 'week', label: '周',checked: true },
        { value: 'month', label: '月',checked: true },
        { value: 'year', label: '年',checked: false },
    ];

    constructor(public configApi: ConfigApi) {
        super(configApi);
    }

    ngOnInit() {
        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];
        this.componentStyleConf(styleConfig);
        
        if (styleConfig && styleConfig["dayWeekMonth"]) {
            this.checkOptions = styleConfig["dayWeekMonth"]
        } else {
            this.checkOptions = this.checkOptions;
        }
        this.OptionChange();
    }

    changeCheck(value: any) {
        this.checkOptions = value;
        this.OptionChange();
    }

    /**
     * 数据改变事件
     */
    OptionChange() {
        let data = {
            dayWeekMonth: this.checkOptions,
            layout: this.layoutStyle,
        }
        this.nofication(this.configApi.scope, data);
    }

}

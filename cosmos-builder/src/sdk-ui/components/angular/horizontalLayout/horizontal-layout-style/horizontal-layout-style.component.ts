import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';
import { DataStore } from 'cosmos-td-sdk';

@Component({
    templateUrl: './horizontal-layout-style.component.html',
    styleUrls: ['./horizontal-layout-style.component.less'],
})
export class HorizontalLayoutStyleComponent extends StylePanel implements OnInit {
    constructor(public configApi: ConfigApi) {
        super(configApi);
    }

    ngOnInit() {
        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];
        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }


    /**
     * 数据改变事件
     */
    OptionChange() {
        let data = {
            layout: this.layoutStyle,
        }
        this.nofication(this.configApi.scope, data);
    }
}

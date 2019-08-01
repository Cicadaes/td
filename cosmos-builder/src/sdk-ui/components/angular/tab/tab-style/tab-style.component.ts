import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';
import { DataStore } from 'cosmos-td-sdk';

@Component({
    templateUrl: './tab-style.component.html',
    styleUrls: ['./tab-style.component.less'],
})
export class TabStyleComponent extends StylePanel implements OnInit {

    dataLabel: boolean = true;

    constructor(public configApi: ConfigApi) {
        super(configApi);
    }

    ngOnInit() {

        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];

        if (styleConfig && styleConfig["dropDown"]) {
            this.dataLabel = styleConfig["dropDown"]
        } else {
            this.dataLabel = this.dataLabel
        }
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

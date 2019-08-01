import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DataStore } from 'cosmos-td-sdk';
import { EventEmitter } from 'cosmos-td-sdk';
import { ComponentEvent, EventType } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';


@Component({
    templateUrl: './date-style.component.html',
    styleUrls: ['./date-style.component.less'],
})

export class DateStyleComponent extends StylePanel implements OnInit {
    constructor(public configApi: ConfigApi) {
        super(configApi);
    }
    ngOnInit() {
        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];
        this.componentStyleConf(styleConfig);

        this.OptionChange();
    }

    OptionChange(event?: Event) {
        let data = {
            layout: this.layoutStyle,
        };
        this.nofication(this.configApi.scope, data);
    }
}

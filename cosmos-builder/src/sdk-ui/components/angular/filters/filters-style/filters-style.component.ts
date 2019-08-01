import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DataStore } from 'cosmos-td-sdk';
import { EventEmitter } from 'cosmos-td-sdk';
import { ComponentEvent, EventType } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';


@Component({
    templateUrl: './filters-style.component.html',
    styleUrls: ['./filters-style.component.less'],
})

export class FiltersStyleComponent extends StylePanel implements OnInit {

    way: any = 'show';
    constructor(public configApi: ConfigApi,
    ) {
        super(configApi);
    }

    ngOnInit() {
        let config = DataStore.getConfigData(this.configApi.scope);

        let styleConfig = config && config["styleConfig"];
        if (styleConfig && styleConfig["way"]) {
            this.way = styleConfig["way"];
        } else {
            this.way = 'show'
        }
        this.componentStyleConf(styleConfig);

        this.OptionChange();
    }

    OptionChange(ant?: any) {
        let data = {
            way: this.way,
            layout: this.layoutStyle,
        };
        this.nofication(this.configApi.scope, data);
    }
}


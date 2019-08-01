import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { StylePanel } from '../../common/style.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';


@Component({

    templateUrl: './rectangle-style.component.html',
    styleUrls: ['./rectangle-style.component.less'],
})
export class RectangleStyleComponent extends StylePanel implements OnInit {

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

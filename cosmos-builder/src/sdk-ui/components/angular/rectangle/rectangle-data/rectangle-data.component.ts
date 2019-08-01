import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { DataPanel, DataConfigKey } from '../../common/data.panel';

@Component({
    templateUrl: './rectangle-data.component.html',
    styleUrls: ['./rectangle-data.component.less'],
})

/**
 * 继承的数据面板中抽象了部分属性和方法
 */
export class RectangleDataComponent extends DataPanel implements OnInit {
    
    constructor(
        public configApi: ConfigApi
    ) {
        super(configApi);
    }

    ngOnInit(){
        
    }
}


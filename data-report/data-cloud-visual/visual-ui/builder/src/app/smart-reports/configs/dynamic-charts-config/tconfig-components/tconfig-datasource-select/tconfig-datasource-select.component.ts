import { StageResourceService } from './../../../../services/stage-service/stage.resource.service';
import { StageService } from './../../../../services/stage.service';
import {DatasourceBaseService} from "./../../../../services/config-service/datasource.base.service";
import { ConfigChartBase } from './../../config-base.model';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'tconfig-datasource-select',
    templateUrl: 'tconfig-datasource-select.component.html',
    styles:[`
    :host /deep/ .ui-dropdown{
    border: 0 none;
    border-bottom: 1px solid rgba(0,0,0,0.12);
}

.tc-select-icon .icon_svg{
    position: relative;
    top: -5px;
}

:host /deep/ .ui-dropdown.ui-state-hover .ui-dropdown-label,
:host /deep/ .ui-dropdown .ui-dropdown-trigger.ui-state-hover{
    background: transparent
}

:host /deep/ .ui-dropdown.ui-state-focus{
    border: 0 none;
    box-shadow: 0 0 0;
}


    `]
})

export class TconfigDatasourceSelectComponent implements OnInit {
    @Input() tconfig: ConfigChartBase;
    @Output() onRender = new EventEmitter<any>();

    private options: Array<any> = [];
    private selectedKey: any;

    private callBackInfo: any

    constructor(private stageService: StageService,
                private stageResourceService: StageResourceService,
                private datasourceService: DatasourceBaseService) {
    }

    ngOnInit() {
        this.handlerOptions()
    }

    handlerOptions() {
        let options;

        options = this.tconfig.optionValues;
        options.forEach((item: any, index: number) => {
            this.options.push({ label: item.name, value: { name: item.value } });
        });

        if(this.tconfig.value.constructor == Object){
            this.selectedKey = { name: this.tconfig.value.value};
        }else{
            this.selectedKey = { name: this.tconfig.value};
        }

        this.tconfig.value = this.selectedKey.name;
    }


    onSelect(e: any) {
        console.log(this.selectedKey);
        this.tconfig.value  = e.value.name,
        this.tconfig.defaultValue = {
            name: e.value.name + "个扇区",
            value: e.value.name
        };
        e.tconfig = this.tconfig;
        this.onRender.emit(e)
    }




}
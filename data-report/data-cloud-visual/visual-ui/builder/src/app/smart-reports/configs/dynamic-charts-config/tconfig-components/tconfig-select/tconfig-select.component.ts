import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'tconfig-select',
    templateUrl: 'tconfig-select.component.html',
    // styleUrls: ['tconfig-select.component.css']
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

.ui-selected .ui-radiobutton-label {
    position: absolute;
    left: calc(50% - 25px);
    bottom: -24px;
    background: #707070;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
    z-index: 2;
    padding: 4px 5px;
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    transform: scale(0);
    -webkit-transition: all ease 0.2s;
    -moz-transition: all ease 0.2s;
    transition: all ease 0.2s;
    font-family: "宋体";
}

.ui-selected{
    position: relative;
    float: left;
}

.ui-selected:hover .ui-radiobutton-label{
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    transform: scale(1);
}
 
    `]
})

export class TconfigSelectComponent implements OnInit {
    @Input() tconfig: ConfigChartBase;
     @Output() onRender = new EventEmitter<any>()

    private options: any=[];
    private selectedKey: any;

    constructor() { }

    ngOnInit() {
        this.handlerOptions()
    }

    handlerOptions() {
        let options;
        if (this.tconfig.valueType === 1) {
            options = this.tconfig.optionValues || '请选择';
            options.forEach((item: any, index: number) => {
                this.options.push({ label: item, value: { name: item } });
            })
        } else if (this.tconfig.valueType === 8) {
            options = this.tconfig.optionValues;
            options.forEach((item: any, index: number) => {
                this.options.push({ label: item.name, value: { name: item.value } });
            })
        }

        this.selectedKey = { name: this.tconfig.value || this.options[0].label };
        this.tconfig.value = this.selectedKey.name;
    }

    select(e: any) {
        this.tconfig.value = e.value.name;
        this.onRender.emit(StageService.transformInput(this.tconfig.code, e.value.name))

    }


}
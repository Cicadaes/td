import { StageResourceService } from './../../../../services/stage-service/stage.resource.service';
import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'tconfig-datatype-select',
    templateUrl: 'tconfig-datatype-select.component.html',
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

export class TconfigDatatypeSelectComponent implements OnInit {
    @Input() tconfig: ConfigChartBase;
    @Output() onRender = new EventEmitter<any>()

    private options: Array<any> = [];
    private selectedKey: any;

    private callBackInfo: any

    constructor(private stageService: StageService,
                private stageResourceService: StageResourceService) {
        this.stageService.PostDataSource$.subscribe((data:any)=>{
            let options;
            if (this.tconfig.valueType === 1) {
                this.options = [];
                let option = this.tconfig.optionValues || 'select';
                options = option.split(',');
                options.forEach((item: any, index: number) => {
                    this.options.push({ label: item, value: { name: item} });
                });
            }
        })
    }

    ngOnInit() {
        console.log(this.tconfig)

        this.handlerOptions(null, () => {
            this.getCallbackInfo()
        })


    }

    getCallbackInfo() {
        let vd = this.tconfig.viewMetaData;
        if (vd) {
            try {
                this.callBackInfo = JSON.parse(vd)
            } catch (e) {
                console.warn(e)
            }
        }
    }



    handlerOptions(opt?: any, cb?: any) {

        let options;
        if (this.tconfig.valueType === 1) {
            this.options = [];
            let option = this.tconfig.optionValues || 'select';
            options = option.split(',');
            options.forEach((item: any, index: number) => {
                this.options.push({ label: item, value: { name: item} });
            })

        } else if (this.tconfig.valueType === 8) {
            this.options = [];
            options = this.tconfig.optionValues;
            options.forEach((item: any, index: number) => {
                this.options.push({ label: item.name, value: { name: item.name } });
            })

        }

        //def
        if (!options.length) {
            this.options.push({ label: this.tconfig.value, value: { name: this.tconfig.value } })
        }


        cb && cb()

    }


    onSelect(e: any) {
        if (e.value.name == this.tconfig.value) {
            return
        }
        if (this.tconfig.code != 'dataSource') {
            this.tconfig.value = e.value.name;
        }else {
            let optionValue = this.tconfig.optionValues,
                tconfigValue = [];
            for(let item of optionValue){
                if(e.value.name == item.name){
                    this.tconfig.value = {
                        id: item.id,
                        name: item.name
                    };
                }
            }

        }

        e.tconfig = this.tconfig;
        this.onRender.emit(e)

    }

    // load options
    onFocus(e: any) {
        if (this.callBackInfo) {
            if (this.callBackInfo.action === 'callBack') {
                this.stageService.todoCallback(this.callBackInfo, (parameters: any, api: string) => {
                    this.options = [];
                    this.stageResourceService.datacb(parameters, api, false).then((d: any) => {
                        this.handlerOptions(d)
                    })
                })
            }
        }

    }




}
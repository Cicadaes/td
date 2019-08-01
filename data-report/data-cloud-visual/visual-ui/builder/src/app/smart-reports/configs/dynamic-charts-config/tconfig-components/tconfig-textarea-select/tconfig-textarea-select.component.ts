import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';


/**
 * Created by lamph on 2017/2/20.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'tconfig-textarea-select',
    templateUrl: 'tconfig-textarea-select.component.html',
    styles:[`
        .smart-ctab .explore_graph_style .tc-inline textarea{
              width:200px !important;
             min-width:200px !important;
             max-width:200px !important;
			 height:100px;
             position:relative;
         }
        textarea{
            width: 200px !important;
            min-width: 200px !important;
            max-width: 200px !important;
            height: 150px;
            position: relative;
            resize: none;
        }
         button{
            width: 60px;
            height: 28px;
            z-index: 7;
            border-color: #4797ed;
            background: #4797ed;
            color: #fff;
            float: right;
            margin-right: 40px;
            position: relative;
            bottom: 40px;
            border-radius: 3px;
         }
    
    `]
})

export class TconfigTextareaSelectComponent {
    @Input() tconfig: any;
    @Output() onRender = new EventEmitter<any>();

    constructor(private stageService: StageService){

    }
    
    ngOnInit() {

    }

    onConfirm(e: any) {
        //设置值
        let sendResult:any;
        if(e !== ""){
            sendResult = JSON.parse(e)
        }else{
            sendResult = {};
        }

        let event = {
            tconfig : this.tconfig,
            result : sendResult
        };

        if(this.tconfig.code == "configure_style"){
            this.onRender.emit(sendResult)
        }else{
            this.onRender.emit(event);
        }

    }

    handlerData(event:any) {

        let e;

        this.tconfig.value[0].id = this.tconfig.value[0].name = event;
        e = {
            tconfig : this.tconfig,
            value: {
                name: event
            }
        };

        this.onRender.emit(e);

    }

}
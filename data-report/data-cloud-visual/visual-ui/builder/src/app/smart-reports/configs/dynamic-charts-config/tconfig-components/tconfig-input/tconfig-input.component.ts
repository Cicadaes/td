import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
    selector: 'tconfig-input',
    templateUrl: 'tconfig-input.component.html',
    // styleUrls: ['tconfig-input.component.css']
    styles:[`
    :host /deep/  .ui-inputtext {
    padding: 0;
    border: 0 none;
    border-bottom: 1px solid rgba(0,0,0,0.12);
    font-size: 12px;
    color: rgba(0,0,0,0.87);
    line-height: 22px;
}
    `]
})

export class TconfigInputComponent implements OnInit {
    @Input() tconfig: ConfigChartBase
    @Output() onRender = new EventEmitter<any>();

    private ticking: boolean = false

    constructor() {

    }
    ngOnInit() {


    }

    onInput(val: string) {
        this.checkInput(this.tconfig);

         if(this.tconfig.value != ""){
            this.onRender.emit(StageService.transformInput(this.tconfig.code, val))
            if (!this.ticking) {
                requestAnimationFrame(this.handlerInput(val));
                this.ticking = true
            }
         }else{
              this.onRender.emit(StageService.transformInput(this.tconfig.code, null))
         }
        

    }

    handlerInput(val:string) {
        let that = this
        return function () {
            that.onRender.emit(StageService.transformInput(that.tconfig.code, val));
            that.ticking = false
        }
    }

    checkInput(tconfig:any){
        if(StageService.checkAxisValue(tconfig).value !== ""){
            tconfig = StageService.checkAxisValue(tconfig);
        }else{
            tconfig.value = "";
            return;
        }
    }


}
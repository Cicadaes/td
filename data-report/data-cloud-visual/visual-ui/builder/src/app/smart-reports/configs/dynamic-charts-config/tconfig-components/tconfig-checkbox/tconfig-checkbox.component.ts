import { StageService } from '../../../../services/stage.service';
import { ConfigChartBase } from '../../config-base.model';
import { Observable } from 'rxjs/Rx';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
    selector: 'tconfig-checkbox',
    templateUrl: 'tconfig-checkbox.component.html'
})

export class TconfigCheckboxComponent implements OnInit {
    @Input() tconfig: ConfigChartBase
    @Output() onRender = new EventEmitter<any>()
    
    constructor() {
        
    }
    ngOnInit() {
        // this.tconfig.value = []
        if(this.tconfig.valueType == 9) {
            switch (this.tconfig.value) {
                case 'true':this.tconfig.value = true;break;
                case 'false':this.tconfig.value = false;break;
            }
        }
    }

    onChange(e: any) {
        this.onRender.emit(StageService.transformInput(this.tconfig.code, e))
    }




}
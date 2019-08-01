import { StageService } from '../../../../services/stage.service';
import { ConfigChartBase } from '../../config-base.model';
import { Observable } from 'rxjs/Rx';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
    selector: 'tconfig-checkbox-input',
    templateUrl: 'tconfig-checkbox-input.component.html'
})

export class TconfigCheckboxInputComponent implements OnInit {
    @Input() tconfig: ConfigChartBase;
    @Output() onRender = new EventEmitter<any>();
    
    constructor() {
        
    }
    ngOnInit() {
        if(this.tconfig.valueType == 8) {
            switch (this.tconfig.value.titleValue) {
                case 'true':
                    this.tconfig.value.titleValue = true;
                    break;
                case 'false':
                    this.tconfig.value.titleValue = false;
                    break;
            }
        }
    }

    onChange(e: any) {
        this.onRender.emit(StageService.transformInput(this.tconfig.code + '_' + 'titleValue', e))
    }

    onInput(val: string) {
        this.onRender.emit(StageService.transformInput(this.tconfig.code + '_' + 'textValue', val))
    }

}
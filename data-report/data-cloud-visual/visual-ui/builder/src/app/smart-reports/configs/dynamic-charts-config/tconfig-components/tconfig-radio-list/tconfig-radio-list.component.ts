import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';
import { Observable } from 'rxjs/Rx';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';


@Component({
    selector: 'tconfig-radio-list',
    templateUrl: 'tconfig-radio-list.component.html',
    // styleUrls: ['tconfig-radio-list.component.css']
})

export class TconfigRadioListComponent implements OnInit {
    @Input() tconfig: ConfigChartBase
    @Output() onRender = new EventEmitter<any>()

    private ticking: boolean = false

    constructor(private stageService: StageService) {

    }
    ngOnInit() {
        this.stageService.legend = StageService.transformInput(this.tconfig.code, this.tconfig.value)
    }

    onSelect(e:any) {
        this.tconfig.value = e.value;
        if(e.valueType === 9) {
            e.value === 'true' && (e.value=true);
            e.value === 'false' && (e.value=false);
        }
        this.stageService.legend = StageService.transformInput(e.code, e.value);
        console.log(this.stageService.legend)
        this.onRender.emit(StageService.transformInput(e.code, e.value))
    }




}
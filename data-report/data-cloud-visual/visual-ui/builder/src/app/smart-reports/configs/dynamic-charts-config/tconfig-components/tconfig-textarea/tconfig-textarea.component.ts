import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';


/**
 * Created by lamph on 2017/2/20.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'tconfig-textarea',
    templateUrl: 'tconfig-textarea.component.html',
    styles:[`
    `]
})

export class TconfigTextareaComponent {
    @Input() tconfig: any;
    @Output() onRender = new EventEmitter<any>()
    
    ngOnInit() {   
    }

}
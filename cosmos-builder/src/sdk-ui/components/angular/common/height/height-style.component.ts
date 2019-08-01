import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';

@Component({
    selector: 'height-adapt',
    templateUrl: './height-style.component.html',
    styleUrls: ['./height-style.component.less'],
})
export class heightStyleComponent implements OnInit {
    heightStyle: any = {};
    
    

    @Input()
    set layoutData(data: any) {
        if (data) {
            Object.assign(this.heightStyle, data);
        } else {
            this.heightStyle = {
                adapt: true,
            };
        }
        this.OptionChange();
    }
    @Output() dataChange = new EventEmitter();

    constructor(private configApi: ConfigApi) {}
    ngOnInit() {

    }
    OptionChange(event?: Event) {
        this.dataChange.emit(this.heightStyle);
    }

}

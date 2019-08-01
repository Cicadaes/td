import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';

@Component({
    selector: 'alignment',
    templateUrl: './alignment-style.component.html',
    styleUrls: ['./alignment-style.component.less'],
})
export class alignmentStyleComponent implements OnInit {
    alignment: any = "left";



    @Input()
    set layoutData(data: any) {
        if (data) {
            this.alignment = data;
        } else {
            this.alignment = "left"
        }
        this.OptionChange();
    }
    @Output() dataChange = new EventEmitter();

    constructor(private configApi: ConfigApi) { }
    ngOnInit() {

    }
    OptionChange(event?: Event) {
        this.dataChange.emit(this.alignment);
    }

}

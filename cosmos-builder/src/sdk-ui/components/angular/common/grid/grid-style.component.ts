import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';

@Component({
    selector: 'grid',
    templateUrl: './grid-style.component.html',
    styleUrls: ['./grid-style.component.less'],
})
export class griedStyleComponent implements OnInit {
    gridStyle: any = {};

    cmcolor: string = "#EDEEF0";
    cmbackground: string = "rgba(0,0,0,0)";
    _cmPosition: string = "left";
    _cmPositionAxis: string = "left";
    _cmPositionOffset: string = "0%";
    _cmPositionOffsetcolor: string = "0%";
    _cmPositionOffsetbackground: string = "0%";
    _cmPresetColors: string[] = ["#ffffff", "#000000", "#2889e9", "#e920e9", "#00afc4", "#fff500", "#ff6530", "#00a150", "#fbc9ef", "#b28850", "#00ffff", "rgb(236,64,64)"];

    @Input()
    set layoutData(data: any) {
        if (data) {
            this.cmcolor = data['color'] || this.cmcolor;
            this.cmbackground = data['background'] || this.cmbackground;
            Object.assign(this.gridStyle, data);
        } else {
            this.gridStyle = {
                horizontalGrid: true,
                verticalGrid: false,
                color: this.cmcolor,
                background: this.cmbackground
            };
        }
        this.OptionChange();
    }

    @Output() dataChange = new EventEmitter();

    constructor(private configApi: ConfigApi) {

    }

    ngOnInit() {

    }

    OptionChange(event?: Event) {
        this.dataChange.emit(this.gridStyle);
    }

}

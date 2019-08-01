import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { Communication, EventType, ComponentEvent, DomEvent, EventEmitter as eventEmitter } from "cosmos-td-sdk";
import { Scope } from '../../../../../app/main/reportconfig/report/report-detail/report-detail-title/createId';


@Component({
    selector: 'set',
    templateUrl: './set-style.component.html',
    styleUrls: ['./set-style.component.less'],
})
export class setStyleComponent implements OnInit {
    private cmSet: any;
    private hei: any;
    private win: any;
    setStyle: any = {};
    setStyleall: any = {
        height: 200,
        width: 200,
    };
    setStylewidth: any = {
        height: 200,
    };
    setStyleheight: any = {
        width: 200,
    };

    @Input()
    set height(height: any) {
        height = Number(height)
        if (height) {
            this.hei = height;
            this.setStylewidth.height = this.hei;
        } else {
            this.hei = 200;
        }
    };
    @Input()
    set width(width: any) {
        width = Number(width)
        if (width) {
            this.win = width;
            this.setStyleheight.width = this.hei;
        } else {
            this.win = 200;
        }
    };

    @Input()
    set setting(setting: any) {
        if (setting) {
            this.cmSet = setting;
        } else {
            this.cmSet = '';
        }
        if (this.cmSet == "height") {
            this.setStyle = this.setStyleheight;
        } else if (this.cmSet == "width") {
            this.setStyle = this.setStylewidth;
        } else {
            this.setStyle = this.setStyleall;
        }
    };

    @Input()
    set layoutData(data: any) {
        if (data) {
            Object.assign(this.setStyle, data);
        } else {
            this.setStyle = this.setStyle;
        }
        this.dataChange.emit(this.setStyle);
    };
    @Output() dataChange = new EventEmitter();
    constructor(private configApi: ConfigApi) { };
    ngOnInit() { }
    /**
     * @param data 
     */
    cent: any;
    OptionChange(data: any, type: any) {
        if (typeof (data) !== 'boolean') {
            let cont = Number(this.setStyle[type])
            if (cont < 0) {
                this.setStyle[type] = 1;
            }
        }
        this.dataChange.emit(this.setStyle);
    };
    inputNumberChange(type: any) {
        if (this.setStyle[type] == null) {
            this.cent = this.deepCopy(this.setStyle[type])
            // this.gridDownload.number = 1;
        } else if (this.setStyle[type] == 0) {
            this.setStyle[type] = 1;
        }
    };
    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    };

}

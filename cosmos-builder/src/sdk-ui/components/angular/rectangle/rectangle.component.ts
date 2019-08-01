import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";

@Component({
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.less']
})
export class RectangleComponent extends Communication implements OnInit, OnDestroy {



    private dataObj: any = {
        data: {},
        style: {}
    };

    constructor() {
        super();
    }

    ngOnInit() {
    }

    public onDataChange(scope: string, data: any) {
        // 这里有个巨坑，暂时不解释
        // 创建一个新实例覆盖触发变更检测
        this.dataObj.data = data;
    }

    public onStyleChange(scope: string, data: any) {
        this.dataObj.style = data;
    }

    public onSizeChange() {
    }

    public onVisualArea(scope: string, data?:any) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope, componentFilter:data });
    }

    ngOnDestroy() {

    }

}

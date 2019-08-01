import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-one-map',
    templateUrl: './one-map.component.html',
    styleUrls: ['./one-map.component.css']
})
export class OneMapComponent implements OnInit, OnChanges {
    @Output() add = new EventEmitter<any>();
    @Output() remove = new EventEmitter<any>();
    @Input() dataSet: any;


    constructor(
    ) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) { }

    addChild(list: any) {
        const obj = {};
        obj['requireType'] = 'yes';
        obj['paramType'] = 'string';
        obj['level'] = list.level + 1;

        if (list.hasOwnProperty('child')) {
            list['child'].push(obj);
        } else {
            list['child'] = [];
            list['child'].push(obj);
        }
    }

    removeOne(list: any, index: any) {
        list.splice(index, 1);
    }

    setWidth(item: any) {
        return (156 - item.level * 16) + 'px';
    }

    // 当输入值的时候取消错误提示
    changeItemError(item: any) {
        if (item.error) {
            delete item.error;
        }
    }

    changeItem(item: any, key: any) {
        if (item[key]) {
            delete item[key];
        }
    }
}

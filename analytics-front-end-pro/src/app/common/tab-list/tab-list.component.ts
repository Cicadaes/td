import {Component, OnInit, Input, OnChanges} from '@angular/core';

@Component({
    selector: 'app-tab-list',
    templateUrl: './tab-list.component.html',
    styleUrls: ['./tab-list.component.less']
})
export class TabListComponent implements OnInit {

    @Input() tabList: any = [];

    constructor() {
    }

    ngOnInit() {
        if (this.tabList.length === 0) {
            this.tabList = [
                {
                    url: '/abc',
                    name: '测试url'
                }
            ];
        }
    }

}

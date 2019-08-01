import {Component, OnInit, OnChanges} from '@angular/core';

@Component({
    selector: 'app-train',
    templateUrl: './train.component.html',
    styleUrls: ['./train.component.less']
})
export class TrainComponent implements OnInit {

    isCollapsed: any;

    crowdVO2: any = {
        crowd: {
            name: '测试人群',
            productId: 3006328
        }
    };

    constructor() {
    }

    ngOnInit() {
    }

}

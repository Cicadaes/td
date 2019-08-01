import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { Globals} from "../../../../utils/globals"

@Component({
    selector: 'app-edm-detail',
    templateUrl: './edm-detail.component.html',
    styleUrls: ['./edm-detail.component.less']
})
export class EdmDetailComponent implements OnInit, OnChanges {
    @Input() isVisible;
    @Input() editData: any;
    @Output() hideDetailDialog = new EventEmitter<any>();
    data: any = {
        edmSenderList: [{ email: '', note: '' }],
    };
    constructor(private globals: Globals) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.editData) {
            this.editData = changes.editData.currentValue;
        }

        if (this.editData) {
            this.data.edmSenderList = this.editData.param.edmSenderList;
            this.data = Object.assign({}, this.data);
        }
    }

     //  取消
     handleCancel = (e) => {
        this.isVisible = false;
        this.globals.resetBodyStyle();
        this.hideDetailDialog.emit(this.isVisible);
    }

}

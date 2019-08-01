import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'app-detail-code',
    templateUrl: './detail-code.component.html',
    styleUrls: ['./detail-code.component.css']
})
export class DetailCodeComponent implements OnInit, OnChanges {
    @Input() isVisible: any;  // 是否显示弹框
    @Input() editData: any;   // 传递过来的当前数据
    @Output() hideDetailDialog = new EventEmitter<any>();

    constructor(
    ) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.isVisible) {
            this.isVisible = changes.isVisible.currentValue;
        }

        if (changes.editData) {
            this.editData = changes.editData.currentValue;
        }

    }

    //  取消
    handleCancel = (e: any) => {
        this.isVisible = false;
        this.hideDetailDialog.emit(this.isVisible);
    }
}

import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'app-detail-domain-name',
    templateUrl: './detail-domain-name.component.html',
    styleUrls: ['./detail-domain-name.component.css']
})

export class DetailDomainNameComponent implements OnInit, OnChanges {
    @Input() isVisible: any;  // 是否显示弹框
    @Input() editData: any;   // 传递过来的当前数据
    @Input() productList: any;
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

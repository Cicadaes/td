import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ValueProvider } from '@angular/core';
import {Globals} from '../../utils/globals';

@Component({
    selector: 'app-modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.less'],
    styles: [`
    ::ng-deep .vertical-center-modal {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    ::ng-deep .vertical-center-modal .ant-modal {
      top: 0;
    }
    ::ng-deep .title {
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: #17233D;
    }
    ::ng-deep .zw-iconfont {
        font-size: 24px;
    }
    ::ng-deep .icon-warning {
        color: #ED4014;
    }
    ::ng-deep .icon-success {
        color: #19BE6B;
    }
    ::ng-deep .icon-info {
        color: #2D8CF0;
    }
    ::ng-deep .icon-help {
        color: #FF9900;
    }
    ::ng-deep .text-content {
        font-size: 14px;
        color: rgba(23,35,61,0.75);
        line-height: 22px;
        margin: 6px 0px 12px 40px;
        word-wrap:break-word;
    }
  ` ]
})
export class ModalDialogComponent implements OnInit, OnChanges {
    _itemObj: any = {};
     /**
     *@param type     // 弹框类型  delete: 删除  confirm: 确定  success: 成功  information: 信息提示
     *@param message  // 要弹出的提示信息
     */

    @Input() set itemObj(data: any) {
        this._itemObj = data;
    }
    @Input() isVisible: any;                                        // 是否显示弹框
    @Output() hideItemDialog = new EventEmitter<any>();             // 点击取消的回传函数
    @Output() confirmHideDialog = new EventEmitter<any>();          // 点击确定的回传函数
    constructor( private globals: Globals) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
//        console.log(changes.isVisible);
        if (changes.isVisible) {
            this.isVisible = changes.isVisible.currentValue;
        }

        // if (changes.itemObj) {
        //     this._itemObj = changes.itemObj.currentValue;
        // }
    }

    // 取消删除
    handleCancel(value: any) {
        this.isVisible = false;
        this.globals.resetBodyStyle();
        this.hideItemDialog.emit(this.isVisible);
    }

    // 确定删除
    confirmCancel(value: any) {
        this.isVisible = false;
        this.globals.resetBodyStyle();
        this.confirmHideDialog.emit(this.isVisible);
    }

}

import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { deptAuthDialogService } from './dept-auth-dialog.service';
import { NzModalService } from 'ng-cosmos-ui';
@Component({
    selector: 'dept-auth-dialog',
    templateUrl: './dept-auth-dialog.component.html',
})
export class AddActionDialogComponent {
    @Input() action: boolean;
    @Input() isShow: boolean = false;
    @Input() tenantId: number;
    @Input() targetId: number;
    @Output() onClose = new EventEmitter<any>();
    // 告知form提交
    @Output() refresh = new EventEmitter<any>();
    private toSubmit: EventEmitter<any> = new EventEmitter<any>();
    isNeedSubmitAddActionFormData: boolean;
    isVisible = false;
    isConfirmLoading = false;
    name: string = '';
    descript: string = '';

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isShow && changes.isShow.currentValue) {
            this.isShow = changes.isShow.currentValue;
        } else {
            this.isShow = false;
        }
        if (this.isShow) {
            this.showModal();
        }
    }
    trim(str: any) { // 正则表达式------去掉字符串前后所有空格
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }
    submitAddActionForm(data: any) {
        this.isNeedSubmitAddActionFormData = false;
        if (data.status == 'VALID') {
            this.isConfirmLoading = true;
            if (this.trim(data.value.name) == '') {
                this.isVisible = false;
                this.isConfirmLoading = false;
                this.onClose.emit(this.isVisible);
                this.confirmServ.warning({
                    nzTitle: '角色层级名称不能为空',
                    nzOnCancel: () => {
                    }
                });
                return;
            } else {
                const params: any = {};
                params.name = this.trim(data.value.name);
                params.tenantId = this.tenantId;
                params.targetId = this.targetId;
                params.description = '';
                if (data.value.desc && data.value.desc.length) {
                    params.description = this.trim(data.value.desc);
                }
                this.name = params.name;
                this.descript = params.description;
                this.service.addAction(params).subscribe((data: any) => {
                    if (data['code'] === 200) {
                        for (let name in params) {
                            delete params[name];
                        }
                        this.isVisible = false;
                        this.isConfirmLoading = false;
                        this.onClose.emit(this.isVisible);
                        this.refresh.emit([data.data, this.name, this.descript]);
                        this.confirmServ.warning({
                            nzTitle: '添加成功',
                            nzOnCancel: () => {
                            }
                        });
                    } else {
                        this.isVisible = false;
                        this.isConfirmLoading = false;
                        this.onClose.emit(this.isVisible);
                        this.confirmServ.warning({
                            nzTitle: data.message,
                            nzOnCancel: () => {
                            }
                        });
                    }

                });
            }

        }
    }

    handleOk = (event: any) => {
        this.isNeedSubmitAddActionFormData = true;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: deptAuthDialogService, private confirmServ: NzModalService) {

    }

}

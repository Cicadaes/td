import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { RolesService } from '../../roles.service';

@Component({
    selector: 'add-user-auth-dialog',
    templateUrl: './add-user-auth-dialog.component.html',
    styleUrls: ['./add-user-auth-dialog.component.css']
})
export class AddUserAuthDialogComponent implements OnInit, OnChanges {
    @Input() isSuper = true;
    @Input() userId = 0;
    @Input() roleId = 0;
    @Input() tenantId = 0;

    isReloadData = false;
    queryParams: any = {};

    _searchValue = '';

    @Input() isShow = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    public toSubmit: EventEmitter<any> = new EventEmitter();



    isNeedSubmit = false;
    isVisible = false;
    isConfirmLoading = false;

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = this.isShow;
        this.isReloadData = this.isShow;
        this.isNeedSubmit = !this.isShow;
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const key in changes) {
            if (key === 'isShow' && changes.isShow.currentValue != null) {
                this.isShow = changes.isShow.currentValue || false;
                this.showModal();
            }
        }
    }

    onSearchUnauthUser(params: any, type: any) {
        const that = this;
        if (type === 'click') {
            if (params) {
                params = params.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.queryParams = {};
            that.queryParams.vroleId = that.roleId;
            that.queryParams.tenantId = that.tenantId;
            that.queryParams.name = params;
        } else {
            if (params.keyCode === 13) {
                if (that._searchValue) {
                    that._searchValue = that._searchValue.replace(/(^\s*)|(\s*$)/g, '');
                }
                that.queryParams = {};
                that.queryParams.vroleId = that.roleId;
                that.queryParams.tenantId = that.tenantId;
                that.queryParams.name = that._searchValue;
            }
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmit = true;
        this.toSubmit.emit();
    }

    onSubmitUserAuth(authSet: any[]) {
        this.service.batchAuthorizeUser(authSet).then((data: any) => {
            if (data.success === true) {
                this.onSubmit.emit(true);
            }
            this.onClose.emit(this.isVisible);
        });
    }


    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: RolesService) {

    }

    ngOnInit() {
        this.queryParams = {};
        this.queryParams.vroleId = this.roleId;
        this.queryParams.tenantId = this.tenantId;
    }
}

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { RolesService } from '../../../../roles.service';
import { TopService } from '../../../../../../main/top/top.service';
import { ActivatedRoute } from '@angular/router';

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
    userTenantId: any;

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
        if (window['appConfig'] && window['appConfig'].tenant && window['appConfig'].tenant.id && window['appConfig'].tenant.id != null) {
            this.userTenantId = window['appConfig'].tenant.id;
        } else if (this.activeRoute.snapshot.params['userId'] != null) {
            this.userTenantId = this.activeRoute.snapshot.params['userId'];
        } else {
            this.userTenantId = 0;
        }
    }

    onSearchUnauthUser(data: any, type: any) {
        const that = this;
        if (type === 'click') {
            if (data) {
                data = data.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.queryParams = {};
            that.queryParams.name = data && data.trim();
            that.queryParams.vroleId = that.roleId;
            that.queryParams.tenantId = that.tenantId;
        } else {
            if (data.keyCode === 13) {
                if (that._searchValue) {
                    that._searchValue = that._searchValue.replace(/(^\s*)|(\s*$)/g, '');
                }
                that.queryParams = {};
                that.queryParams.name = that._searchValue && that._searchValue.trim();
                that.queryParams.vroleId = that.roleId;
                that.queryParams.tenantId = that.tenantId;
            }
        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmit = true;
        this.toSubmit.emit();
    }

    onSubmitUserAuth(authSet: any[]) {
        if (authSet.length > 0) {
            const obj = {
                vroleId: Number(authSet[0].vroleId),
                userId: authSet[0].userId
            };
            this.service.updateTenantUser(obj).then((data: any) => {
                if (data.success === true) {
                    if (this.userTenantId !== '0' && this.userTenantId !== 0) {
                        this.topService.logout().then((response: any) => {
                            if (response && response.service) {
                                const _url = response.service + window.location.origin + response.redirect + window.location.href;
                                window.location.href = _url;
                            }
                        }).catch((err: any) => {
                        });
                    }
                    this.onSubmit.emit(true);
                }
                this.onClose.emit(this.isVisible);
            });
        } else {
            this.onClose.emit(this.isVisible);
        }
    }


    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: RolesService,
        private topService: TopService,
        private activeRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.queryParams = {};
        this.queryParams.name = null;
        this.queryParams.vroleId = this.roleId;
        this.queryParams.tenantId = this.tenantId;
    }
}

import { Component, OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';
import { UserGroupAuthService } from './user-group-auth.service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'user-group-auth',
    templateUrl: './user-group-auth.component.html',
    styleUrls: ['./user-group-auth.component.css']
})
export class UserGroupAuthComponent implements OnInit, OnDestroy {
    @Input() tenantId: number;
    @Input() userId: number;
    @Input() roleId: number;

    private _batchRemove: EventEmitter<any> = new EventEmitter();

    userGroup: any = {};

    isShowAddUserGroupAuthModal = false;
    isConfirmLoading: boolean;
    doBatchRevoke: boolean;
    batchRemoveUsers: boolean;

    userGroupAuthFieldArray: any[] = [{
        id: 1,
        fieldName: 'name',
        fieldLabel: '名称',
        fieldType: 'input'
    }];
    search: any;

    private refresh: EventEmitter<any> = new EventEmitter<any>();


    constructor(private service: UserGroupAuthService, private confirmServ: NzModalService) {
        // this.userGroupAuthTableAjaxUrl = service.getUserGroupAuthUrl;
    }

    showConfirm() {
        this.confirmServ.confirm({
            nzTitle: '确认要移除所选用户组吗？',
            nzContent: '<strong></strong>',
            nzOnOk: () => {
                console.log('确定');
                // this._batchRemove.emit(true)
                this.doBatchRevoke = true;
            },
            nzOnCancel: () => {
                this.doBatchRevoke = false;
            }
        });
    }

    showInfo() {
        this.confirmServ.info({
            nzTitle: '这是一条通知信息',
            nzContent: '信息内容'
        });
    }

    showAddUserGroupAuthModal() {
        this.refresh.emit({ type: 0 });
        this.isShowAddUserGroupAuthModal = true;
    }

    hideAddUserGroupAuthModal(params: any) {
        this.isShowAddUserGroupAuthModal = false;
    }

    onSubmitUserFormData(params: boolean) {
        this.userGroup = {};
        this.userGroup.tenantId = this.tenantId;
        this.userGroup.id = this.roleId;
    }

    setUserGroupParams() {
        this.userGroup.tenantId = this.tenantId;
        this.userGroup.id = this.roleId;
    }

    onSearchUserGroupAuthList(params: any) {
        this.userGroup = params;
        this.setUserGroupParams();
    }

    onSearch(params: any, type: any) {
        const that = this;
        if (type === 'click') {
            if (params) {
                params = params.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.userGroup = { 'name': params };
            that.setUserGroupParams();
        } else {
            if (params.keyCode === 13) {
                if (that.search) {
                    that.search = that.search.replace(/(^\s*)|(\s*$)/g, '');
                }
                that.userGroup = { 'name': that.search };
                that.setUserGroupParams();
            }
        }
    }

    ngOnInit() {
        this.setUserGroupParams();
    }

    ngOnDestroy() {

    }

    batchRevoke = (event: any) => {

        if (this.checkedItem) {
            this.confirmServ.confirm({
                nzTitle: '您确认要批量移除选定用户组吗？',
                nzContent: '<strong></strong>',
                nzOnOk: () => {
                    this._batchRemove.emit(true);
                }
            });
        } else {
            this.confirmServ.info({
                nzTitle: '请勾选用户组',
                nzContent: '<strong></strong>',
            });
        }

    }

    private checkedItem = '';
    /**
     * 获取选中的dataset的name
     * @return {[type]} [description]
     */
    private setCheckedItem(e: any) {
        const str = '';
        if (e && e.length) {
            const nameArr = e.filter((item: any) => {
                return item.checked;
            }).map((item: any) => {
                return item.name;
            });
            this.checkedItem = nameArr.join(',');
        } else {
            this.checkedItem = '';
        }
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from './users.service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
    userFieldArray: any[];
    userTableFieldParams: any;
    userTableAjaxUrl: string;
    isShowAddUerModal = false;
    isReloadUserTable = false;

    constructor(private service: UsersService, private confirmServ: NzModalService) {
        this.userTableAjaxUrl = service.getUsersUrl;
    }

    showConfirm() {
        this.confirmServ.confirm({
            nzTitle: '您是否确认要删除这项内容',
            nzContent: '<strong>一些解释</strong>',
            nzOnOk() {
                console.log('确定');
            },
            nzOnCancel() {
            }
        });
    }

    showInfo() {
        this.confirmServ.info({
            nzTitle: '这是一条通知信息',
            nzContent: '信息内容'
        });
    }

    showAddUserModal() {
        this.isReloadUserTable = false;
        this.isShowAddUerModal = true;
    }

    hideAddUserModal(params: any) {
        this.isShowAddUerModal = false;
    }

    onSubmitUserFormData(params: boolean) {
        this.isReloadUserTable = params || false;
    }

    onSearchUserList(params: any) {
        this.userTableFieldParams = params;
    }

    initUserFieldArray(): void {
        this.userFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '姓名',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'email',
            fieldLabel: '账号',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'mobile',
            fieldLabel: '手机',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'status',
            fieldLabel: '状态',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '正常'
            }, {
                value: '0',
                label: '禁用'
            }]
        }];
    }

    ngOnInit() {
        this.initUserFieldArray();
    }

    ngOnDestroy() {

    }

}

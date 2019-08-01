import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { OrgRolesTableDialogService } from './orgroles-table-dialog.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'orgroles-table-dialog',
    templateUrl: './orgroles-table-dialog.component.html',
    styleUrls: ['./orgroles-table-dialog.component.css']
})
export class OrgRolesTableDialogComponent implements OnInit, OnChanges {
    @Input() user: boolean;
    @Input() isShow = false;
    @Input() organization: any;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

    isNeedSubmitUgRolesTableFormData: boolean;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    isReloadRoleTable = false;
    userGroupId: any;
    checkedRole: any[] = [];
    rolesFieldArray: any[];
    orgrolesTableFieldParams: any;

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
        this.isReloadRoleTable = false;
    }
    search: any;

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

    initFieldArray() {
        this.rolesFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '名称',
            fieldType: 'input'
        }];
    }

    onSearch(value: any, type: any) {
        const that = this;
        if (type === 'click') {
            if (value) {
                value = value.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.orgrolesTableFieldParams = { 'name': value };
        } else {
            if (value.keyCode === 13) {
                if (that.search) {
                    that.search = that.search.replace(/(^\s*)|(\s*$)/g, '');
                }
                that.orgrolesTableFieldParams = { 'name': that.search };
            }
        }
    }

    onSearchList(params: any) {
        this.orgrolesTableFieldParams = params;
    }

    onCheckAddUgRoles(users: any[]) {
        this.checkedRole = users;
    }
    addUgRole(obj: any) {
        this.service.addUgRole(obj).then((data: any) => {
            this.isVisible = false;
            this.isSubmit = true;
            this.isConfirmLoading = false;
            this.isReloadRoleTable = true;
            this.onClose.emit(this.isVisible);
            this.onSubmit.emit(this.isSubmit);
        });
    }
    submitUgRolesTableForm(data: any) {
        this.isNeedSubmitUgRolesTableFormData = false;
        if (data.status === 'VALID') {
            this.isConfirmLoading = true;
            if (!this.userGroupId) {
                this.userGroupId = this.route.snapshot.params['id'];
            }
            data.value['virtualRoleId'] = this.userGroupId;
            this.addUgRole(data.value);

        }
    }

    handleOk = (e: any) => {
        this.isNeedSubmitUgRolesTableFormData = true;
        this.checkedRole.forEach((role: any, index: any) => {
            this.isConfirmLoading = true;
            const roleRelation = {
                vroleId: this.organization.id,
                roleId: role.id,
                createUserId: 1,
                updateUserId: 1
            };
            this.addUgRole(roleRelation);
        });

    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    ngOnInit() {
        this.initFieldArray();
    }

    constructor(private service: OrgRolesTableDialogService, private router: Router, private route: ActivatedRoute) {

    }

}

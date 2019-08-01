import { Component, OnInit, Input } from '@angular/core';
import { RolePermissionService } from './role-permission.service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html',
    styleUrls: ['./role-permission.component.css'],
    providers: [RolePermissionService]
})
export class RolePermissionComponent implements OnInit {

    dataSet: any = [];                          // 列表数据
    total: number;                              // 总数
    pageIndex: number = 1;                      // 当前页
    pageSize: number = 10;                      // 每页显示条数

    allChecked: boolean;                        // 全选

    isShowModal: boolean;                       // 弹框展示
    modalTitle: string;                         // 弹窗title
    errorInfo: any = {};                        // 错误信息

    roleList: any = [];                         // 排除已添加的角色列表
    rolePermissionInfo: any = {};               // 角色权限信息
    searchInput: string;                        // 搜索输入框内容

    @Input() tenantId: any;                     // 租户ID
    @Input() targetId: any;                     // 数据对象id

    constructor(
        private rolePermissionService: RolePermissionService,
        private confirmServ: NzModalService,
        private notificationService: NzNotificationService,
    ) { }

    ngOnInit() {
        this.getList();
    }

    /**
     * 角色名称搜索
     * @param event 
     */
    onSearch(event: any) {
        this.getList();
    }

    /**
     * 获取角色权限列表
     */
    getList() {
        let param = {
            targetId: this.targetId,
            tenantId: this.tenantId,
            page: this.pageIndex,
            pageSize: this.pageSize,
            roleName: this.searchInput && this.searchInput.trim() && encodeURIComponent(this.searchInput),
        };

        this.rolePermissionService.query(param).then((response: any) => {
            let data = response['data'];
            this.total = data.total;
            this.dataSet = data.data;
            if(this.dataSet.length === 0 && this.total > 0) {
                this.pageIndex --;
                this.getList();
                return ;
            }
            this.refreshStatus();
        });
    }

    /**
     * 分页信息改变
     * @param value 
     */
    pageInfoChange(value?: boolean) {
        if (value) {
            this.pageIndex = 1;
        }
        this.getList();
    }

    /**
     * 改变角色
     * @param value 
     */
    changeRole(value?: Event) {
        if (!this.rolePermissionInfo['roleId']) {
            this.errorInfo.roleError = true;
            this.errorInfo.roleErrorInfo = "请选择角色";
            return false;
        } else {
            if (value) {
                this.rolePermissionService.getRolePermission(value, this.targetId).then(response => {
                    if (response['code'] === 200) {
                        this.rolePermissionInfo.authBeans = response['data']['authBeans'];
                    }
                });
            }
            this.errorInfo.roleError = false;
            return true;
        }
    }

    /**
     * 勾选权限
     * @param event 
     */
    changeAuthBean(event?: Event) {
        if (!this.rolePermissionInfo.authBeans.length) {
            this.errorInfo.operationError = true;
            this.errorInfo.operationErrorInfo = "请先到数据对象详情页设置操作权限";
            return false;
        } else {
            let flag = false;
            this.rolePermissionInfo.authBeans.forEach(element => {
                if (element['hasAuth']) {
                    flag = true;
                }
            });
            if (!flag) {
                this.errorInfo.operationError = true;
                this.errorInfo.operationErrorInfo = "请勾选操作权限";
                return false;
            } else {
                this.errorInfo.operationError = false;
                return true;
            }
        }
    }

    /**
     * 触发全选
     * @param event 
     */
    checkAll(event: Event) {
        this.dataSet.forEach(data => {
            data.checked = event;
        });
    }

    /**
     * 勾选当前数据
     * @param event 
     */
    refreshStatus(event?: Event) {
        let allChecked = true;
        this.dataSet.forEach(value => {
            if (!value.checked) {
                allChecked = false;
            }
        });

        this.allChecked = this.dataSet.length > 0 && allChecked;
    }

    /**
     * 通过targetId和tenantId获取角色列表
     */
    getRolesFilterTenantId() {
        return this.rolePermissionService.getRolesFilterTenantId({ targetId: this.targetId, tenantId: this.tenantId }).then(repsonse => {
            if (repsonse['code'] === 200) {
                this.roleList = repsonse['data'];
            }
        });
    }

    /**
     * 添加角色权限
     */
    addRolePermisssion() {
        this.modalTitle = '新建角色对数据对象的操作权限';
        this.isShowModal = true;
        this.getRolesFilterTenantId();
    }

    /**
     * 弹框确认
     * @param event 
     */
    modalSubmit(event: Event) {
        if (!this.changeRole() || !this.changeAuthBean()) {
            return;
        }
        let param = Object.assign({}, this.rolePermissionInfo);
        param['targetId'] = this.targetId;
        param['tenantId'] = this.tenantId;
        if (param['id']) {          // 修改
            this.rolePermissionService.update(param).then(repsonse => {
                repsonse = repsonse['status'] === 200 && JSON.parse(repsonse['_body']);
                if (repsonse['code'] === 200) {
                    this.handleCancel();
                    this.getList();
                }
            });
        } else {                    // 新建
            this.rolePermissionService.create(param).then(repsonse => {
                if (repsonse['code'] === 200) {
                    this.handleCancel();
                    this.getList();
                }
            });
        }
    }

    /**
     * 编辑
     * @param data 
     */
    async editor(data: any) {
        this.modalTitle = '修改角色对数据对象的操作权限';
        this.isShowModal = true;
        this.rolePermissionService.getRolePermission(data.roleId, this.targetId).then(response => {
            if (response['code'] === 200) {
                this.rolePermissionInfo = response['data'];
            }
        });
    }

    /**
     * 删除
     * @param data 
     */
    delete(data: any) {
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: `你确定要删除角色 ${data.roleName} 对当前数据对象的权限定义吗？`,
            nzOnOk: () => {
                this.deletePermission(data.roleId);
            }
        });
    }

    /**
     * 批量删除按钮
     */
    deleteBatch() {
        let arr = [], nameList = '';
        this.dataSet.forEach(data => {
            if (data.checked) {
                arr.push(data.roleId);
                nameList += `<br />${data.roleName}`
            }
        });

        if (arr.length === 0) {
            this.notificationService.info('提示', "请先勾选需要操作的角色权限");
            return;
        }

        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: `你确定要删除如下所选角色对当前数据对象的权限定义吗？${nameList}`,
            nzOnOk: () => {
                this.deletePermission(arr);
            }
        });
    }

    /**
     * 删除角色权限
     * @param roleIds 
     */
    deletePermission(roleIds: any) {
        this.rolePermissionService.deleteRolePermission(roleIds, this.targetId).then((response: any) => {
            if (response['code'] === 200) {
                this.getList();
            } else {
                this.notificationService.warning('warning', response['message']);
            }
        });
    }

    /**
     * 关闭弹框
     */
    handleCancel() {
        this.isShowModal = false;
        this.rolePermissionInfo = {};
        this.errorInfo = {};
    }
}

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { permissionsService } from './permissions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-cosmos-ui';
import { RegexpSService } from 'src/app/@core/data/regexps.service';
@Component({
    selector: 'permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.css']
})
export class permissionsComponent implements OnInit, OnDestroy {
    userId: number = 0;
    tenantId: number = 0;
    isSuper: boolean = false;
    isReloadUserTable: boolean = true;

    user: any;
    roleSearch: any = {};
    newRole: any;

    roleFieldArray: any[];

    modalTitle: string = '新建数据对象';                      // 弹出框标题
    isShowModal: boolean = false;                           // 弹出框展示
    errorInfo: any = {};                                    // 错误信息
    objInfo: any = {};                                      // 数据对象信息

    constructor(
        private service: permissionsService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private notification: NzNotificationService,
        private regexpSService: RegexpSService) {
        setTimeout(() => {
            if (this.activeRoute.snapshot.params['tenantId'] != null) {
                this.tenantId = this.activeRoute.snapshot.params['tenantId'];
            } else if (window['appConfig'] && window['appConfig'].tenant) {
                this.tenantId = window['appConfig'].tenant.id;
            } else {
                this.tenantId = 0;
            }
            this.getRoleCode();
        }, 300);
    }

    ngOnInit() {
        this.initRoleFieldArray();
    }

    ngOnDestroy() {
    }

    getRoleCode(): void {
        this.service.getRoleCode().then((roleCode: any) => {
            this.isSuper = (roleCode == 'UM_SUPER_ADMIN');
        }).catch((err: any) => {
            console.log(err);
        });
    }

    initRoleFieldArray(): void {
        this.roleFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '名称',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'createUserName',
            fieldLabel: '创建人',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'createTimeRange',
            fieldLabel: '创建时间',
            fieldType: 'date-range'
        }, {
            id: 4,
            fieldName: 'updateUserName',
            fieldLabel: '更新人',
            fieldType: 'input'
        }, {
            id: 5,
            fieldName: 'updateTimeRange',
            fieldLabel: '更新时间',
            fieldType: 'date-range'
        }];
    }

    /**
     * 展示新建或者编辑的数据对象
     * @param data 
     */
    showAddDataObjModal(data?: any) {
        this.isShowModal = true;
        this.isReloadUserTable = false;
        if (data) {
            this.objInfo = data;
            this.modalTitle = '编辑数据对象';
        } else {
            this.objInfo = {};
            this.modalTitle = '新建数据对象';
        }
    }

    /**
     * 数据对象弹框提交
     * @param event 
     */
    modalSubmit(event: Event) {
        if (!this.changeName() || !this.changeCode() || !this.changeUrl() || !this.changeDescription()) {
            return;
        }
        let param = Object.assign({}, this.objInfo);
        param['tenantId'] = this.tenantId;
        param['description'] = this.objInfo.description && this.objInfo.description.trim()
        // saveDataObj
        if (param.id) {      // 更新数据对象
            this.service.updateDataObj(param).then(response => {
                if (response['code'] != 200) {
                    this.notification.error('error', response['message']);
                } else {
                    this.isShowModal = false;
                    this.isReloadUserTable = true;  // 重新刷新列表
                }
            });
        } else {
            // 保存数据对象
            this.service.saveDataObj(param).then(response => {
                if (response['code'] != 200) {
                    this.notification.error('error', response['message']);
                } else {
                    this.isShowModal = false;
                    this.isReloadUserTable = true;  // 重新刷新列表
                }
            });
        }
    }

    handleCancel(event: Event) {
        this.isShowModal = false;
        this.errorInfo = {};
    }

    onSubmitUserFormData(params: boolean) {
        this.isReloadUserTable = params || false;
    }

    onSearchRoleList(roleSearch: any) {
        this.roleSearch = roleSearch;
        this.roleSearch.tenantId = this.tenantId;
    }

    onSearch(value: any) {
        this.roleSearch = { 'name': value };
        this.roleSearch.tenantId = this.tenantId;
    }

    /**
     * 名称（校验）
     * @param event 
     */
    changeName(event?: Event) {
        if (this.objInfo && !this.objInfo.name) {
            this.errorInfo.nameError = true;
            this.errorInfo.nameErrorInfo = "请输入对象名称";
            return false;
        }
        if (!/^\S.*\S$|^\S$/.test(this.objInfo.name)) {
            this.errorInfo.nameError = true;
            this.errorInfo.nameErrorInfo = "开头结尾不能有空格";
            return false;
        } else if (!/^[a-zA-Z\d\u4e00-\u9fa5\-\_\&\\s]{2,50}$/.test(this.objInfo.name)) {
            this.errorInfo.nameError = true;
            this.errorInfo.nameErrorInfo = "只能输入中文、数字、英文字母、“-_&”、空格，长度最少2个字符、最多50个字符";
            return false;
        } else {
            this.errorInfo.nameError = false;
            this.errorInfo.nameErrorInfo = '';
            return true;
        }
    }

    /**
     * 编码（校验）
     * @param event 
     */
    changeCode(event?: Event) {
        if (this.objInfo && !this.objInfo.code) {
            this.errorInfo.codeError = true;
            this.errorInfo.codeErrorInfo = "请输入对象编码";
            return false;
        }
        if (!(this.regexpSService.getCode().test(this.objInfo.code))) {
            this.errorInfo.codeError = true;
            this.errorInfo.codeErrorInfo = "只能输入数字、英文字母，长度最少2个、最多50个字符";
            return false;
        } else {
            this.errorInfo.codeError = false;
            this.errorInfo.codeErrorInfo = '';
            return true;
        }
    }

    /**
     * url（校验）
     * @param event 
     */
    changeUrl(event?: Event) {
        if (this.objInfo.restUrl && !(this.regexpSService.getUrl().test(this.objInfo.restUrl))) {
            this.errorInfo.urlError = true;
            this.errorInfo.urlErrorInfo = "URL地址格式不正确";
            return false;
        } else {
            this.errorInfo.urlError = false;
            this.errorInfo.urlErrorInfo = '';
            return true;
        }
    }

    /**
     * 描述（校验）
     * @param event 
     */
    changeDescription(event?: Event) {
        if (this.objInfo.description && this.objInfo.description.length > 200) {
            this.errorInfo.descriptionError = true;
            this.errorInfo.descriptionErrorInfo = "描述长度不能大于200";
            return false;
        } else {
            this.errorInfo.descriptionError = false;
            this.errorInfo.descriptionErrorInfo = '';
            return true;
        }
    }

}

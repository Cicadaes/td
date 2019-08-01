import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LogsService } from './logs.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit, OnDestroy {

    isReloadData =  false;
    isTenant =  false;
    tenantId = 0;
    user: any = {};
    logQuery: any = {};
    appName: any;
    operType: any;
    operObjectType: any;
    appNames: any = [];
    operTypes: any = [];
    operObjectTypes: any = [];
    logQueryFieldArray: any[] = [
        {
            id: 1,
            fieldName: 'tenantName',
            fieldLabel: '租户名称',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'creator',
            fieldLabel: '操作员姓名',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'createBy',
            fieldLabel: '操作人员账号',
            fieldType: 'input'
        },
        {
            id: 4,
            fieldName: 'operResult',
            fieldLabel: '操作结果',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [
                {
                    value: '',
                    label: '全部'
                }, {
                    value: '成功',
                    label: '成功'
                }, {
                    value: '失败',
                    label: '失败'
                }
            ]
        },

        {
            id: 5,
            fieldName: 'operObjectId',
            fieldLabel: '操作对象ID',
            fieldType: 'input'
        }, {
            id: 6,
            fieldName: 'operObjectName',
            fieldLabel: '操作对象名称',
            fieldType: 'input'
        },
        {
            id: 7,
            fieldName: 'createTimeRange',
            fieldLabel: '操作时间',
            fieldType: 'date-range',
            time: 0
        },
        {
            id: 8,
            fieldName: 'operType',
            fieldLabel: '操作类型',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [
                {
                    value: '',
                    label: '全部'
                }, {
                    value: '新建',
                    label: '新建'
                }, {
                    value: '修改',
                    label: '修改'
                }, {
                    value: '启用',
                    label: '启用'
                }, {
                    value: '禁用',
                    label: '禁用'
                }, {
                    value: '查询',
                    label: '查询'
                }, {
                    value: '访问',
                    label: '访问'
                }, {
                    value: '登录',
                    label: '登录'
                }, {
                    value: '退出',
                    label: '退出'
                }
            ]
        },
        {
            id: 9,
            fieldName: 'appName',
            fieldLabel: '对象所属应用',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [
                {
                    value: '',
                    label: '全部'
                }, {
                    value: '角色',
                    label: '角色'
                }, {
                    value: '用户',
                    label: '用户'
                }, {
                    value: '用户组',
                    label: '用户组'
                }, {
                    value: '组织机构',
                    label: '组织机构'
                }, {
                    value: '应用',
                    label: '应用'
                }, {
                    value: '许可证',
                    label: '许可证'
                }, {
                    value: '产品',
                    label: '产品'
                }, {
                    value: '渠道 ',
                    label: '渠道 '
                }
            ]
        },
        {
            id: 10,
            fieldName: 'operObjectType',
            fieldLabel: '操作对象类型',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [
                {
                    value: '',
                    label: '全部'
                }, {
                    value: '角色',
                    label: '角色'
                }, {
                    value: '用户',
                    label: '用户'
                }, {
                    value: '用户组',
                    label: '用户组'
                }, {
                    value: '组织机构',
                    label: '组织机构'
                }, {
                    value: '应用',
                    label: '应用'
                }, {
                    value: '许可证',
                    label: '许可证'
                }, {
                    value: '产品',
                    label: '产品'
                }, {
                    value: '渠道 ',
                    label: '渠道 '
                }
            ]
        },
    ];

    constructor(private service: LogsService, private activeRoute: ActivatedRoute) {
    }
    /**
     * 加载条件
     */
    condition() {
        if (this.activeRoute.snapshot.params['tenantId'] != null) {
            this.tenantId = this.activeRoute.snapshot.params['tenantId'];
        } else if (window['appConfig'] && window['appConfig'].tenant) {
            if (window['appConfig'].tenant.id != null) {
                this.tenantId = window['appConfig'].tenant.id;
            } else {
                this.tenantId = 0;
            }
        } else {
            this.tenantId = 0;
        }
    }
    async ngOnInit() {
        this.appName = await this.service.appName('appName');
        this.operType = await this.service.operType('operType');
        this.operObjectType = await this.service.operObjectType('operObjectType');
        this.appNames = [];
        this.operTypes = [];
        this.operObjectTypes = [];
        for (let k = 0; k < this.appName.data.length; k++) {
            this.appNames.push({
                value: this.appName.data[k].dicKey,
                label: this.appName.data[k].dicValue
            });
        }
        for (let k = 0; k < this.operType.data.length; k++) {
            this.operTypes.push({
                value: this.operType.data[k].dicKey,
                label: this.operType.data[k].dicValue
            });
        }
        for (let k = 0; k < this.operObjectType.data.length; k++) {
            this.operObjectTypes.push({
                value: this.operObjectType.data[k].dicKey,
                label: this.operObjectType.data[k].dicValue
            });
        }
        this.appNames.unshift({
            value: '',
            label: '全部'
        });
        this.operTypes.unshift({
            value: '',
            label: '全部'
        });
        this.operObjectTypes.unshift({
            value: '',
            label: '全部'
        });
        setTimeout(() => {
            this.condition();
            this.getUser();
            this.initLogFieldArray();
            this.onSearchLogList();
        }, 0);
    }
    async test() {
        this.appName = await this.service.appName('appName');
        this.operType = await this.service.operType('operType');
        this.operObjectType = await this.service.operObjectType('operObjectType');
    }
    ngOnDestroy() {

    }
    /**
     * 用户等级区分
     */
    getUser(): void {
        this.service.getUser().then(user => {
            this.user = user;
            if (this.tenantId > 0) {
                this.tenantId = this.user.tenantId;
                this.logQuery.tenantId = this.tenantId;
            }
        });
    }
    getRoleCode(): void {
        this.service.getRoleCode().then((roleCode: any) => {
            this.isTenant = (roleCode !== 'UM_SUPER_ADMIN' && roleCode !== 'UM_OPER_ADMIN');
        }).catch((err: any) => {
            console.log(err);
        });
    }
    /**
     * 查询条件
     */
    initLogFieldArray(): void {
        if (this.tenantId !== 0) {
            this.logQueryFieldArray = [
                {
                    id: 1,
                    fieldName: 'creator',
                    fieldLabel: '操作员姓名',
                    fieldType: 'input'
                }, {
                    id: 2,
                    fieldName: 'createBy',
                    fieldLabel: '操作员账号',
                    fieldType: 'input'
                },
                {
                    id: 3,
                    fieldName: 'operObjectId',
                    fieldLabel: '操作对象ID',
                    fieldType: 'input'
                }, {
                    id: 4,
                    fieldName: 'operObjectName',
                    fieldLabel: '操作对象名称',
                    fieldType: 'input'
                }, {
                    id: 5,
                    fieldName: 'operResult',
                    fieldLabel: '操作结果',
                    fieldType: 'select',
                    apiData: false,
                    initValue: null,
                    selectOptions: [
                        {
                            value: '',
                            label: '全部'
                        }, {
                            value: '成功',
                            label: '成功'
                        }, {
                            value: '失败',
                            label: '失败'
                        }
                    ]
                }, {
                    id: 6,
                    fieldName: 'createTimeRange',
                    fieldLabel: '操作时间',
                    fieldType: 'date-range',
                    time: 0
                },
                {
                    id: 7,
                    fieldName: 'operType',
                    fieldLabel: '操作类型',
                    fieldType: 'select',
                    apiData: false,
                    initValue: '',
                    selectOptions: this.operTypes
                }, {
                    id: 8,
                    fieldName: 'operObjectType',
                    fieldLabel: '操作对象类型',
                    fieldType: 'select',
                    apiData: false,
                    initValue: '',
                    selectOptions: this.operObjectTypes
                },

            ];
        } else {
            this.logQueryFieldArray = [
                {
                    id: 1,
                    fieldName: 'tenantName',
                    fieldLabel: '租户名称',
                    fieldType: 'input'
                }, {
                    id: 2,
                    fieldName: 'creator',
                    fieldLabel: '操作员姓名',
                    fieldType: 'input'
                }, {
                    id: 3,
                    fieldName: 'createBy',
                    fieldLabel: '操作员账号',
                    fieldType: 'input'
                },
                {
                    id: 4,
                    fieldName: 'operResult',
                    fieldLabel: '操作结果',
                    fieldType: 'select',
                    apiData: false,
                    initValue: null,
                    selectOptions: [
                        {
                            value: '',
                            label: '全部'
                        }, {
                            value: '成功',
                            label: '成功'
                        }, {
                            value: '失败',
                            label: '失败'
                        }
                    ]
                },

                {
                    id: 5,
                    fieldName: 'operObjectId',
                    fieldLabel: '操作对象ID',
                    fieldType: 'input'
                }, {
                    id: 6,
                    fieldName: 'operObjectName',
                    fieldLabel: '操作对象名称',
                    fieldType: 'input'
                },
                {
                    id: 7,
                    fieldName: 'createTimeRange',
                    fieldLabel: '操作时间',
                    fieldType: 'date-range',
                    time: 0
                },
                {
                    id: 8,
                    fieldName: 'operType',
                    fieldLabel: '操作类型',
                    fieldType: 'select',
                    apiData: false,
                    initValue: '',
                    selectOptions: this.operTypes
                },
                {
                    id: 9,
                    fieldName: 'appName',
                    fieldLabel: '对象所属应用',
                    fieldType: 'select',
                    apiData: false,
                    initValue: '',
                    selectOptions: this.appNames
                },
                {
                    id: 10,
                    fieldName: 'operObjectType',
                    fieldLabel: '操作对象类型',
                    fieldType: 'select',
                    apiData: false,
                    initValue: '',
                    selectOptions: this.operObjectTypes
                },
            ];
        }
    }
    /**
     * 默认tenantId+operType
     * @param logQuery
     */
    onSearchLogList(logQuery: any = {}) {
        if (this.tenantId > 0) {
            logQuery.tenantId = this.tenantId;
            // logQuery.operType = '登陆';
        }
        this.logQuery = logQuery;
        this.isReloadData = true;
    }
}

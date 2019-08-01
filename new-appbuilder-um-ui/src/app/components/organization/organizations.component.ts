import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrganizationsService } from './organizations.service';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';
import { NgZorroAntdModule, NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'organizations',
    templateUrl: './organizations.component.html',
    styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit, OnDestroy {
    isShowAddOrganizationModal = false;
    showAdd = true;
    uguserFieldArray: any[];
    tenantId: any;
    organizationTreeData: any = {};
    organization: any = {};
    currOrganization: any = {};
    tenant: any;
    currentData: any;
    checkedData: any;
    isedit = false;
    rolecode: any;
    curId: any;
    isloading = false;
    constructor(private service: OrganizationsService,
        private confirmServ: NzModalService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private not: NgZorroAntdModule
    ) {

    }

    addOrganization = (e: any) => {
        this.showOrganizationModal();
    }

    showOrganization = (data: any) => {
        this.organization = data;
        //  this.showAddOrganizationModal();
    }

    showOrganizationModal() {
        this.isShowAddOrganizationModal = true;
        this.initCompany();
    }

    initCompany() {
        this.organization.id = 0;
        this.organization.name = this.tenant.companyName;
        this.organization.tenantId = this.tenantId;
    }

    hideAddAppModal() {
        this.isShowAddOrganizationModal = false;
        this.isedit = false;
    }

    queryOrganizationTreeData() {
        this.organizationTreeData = {
            hasChecked: false, //  需要复选框
            needMenu: true, //  需要菜单
            menu: [{
                value: '新建',
                label: 'createOrg',
                disabled: false
            },
            {
                value: '删除',
                label: 'deleteOrg',
                disabled: false
            },
            {
                value: '编辑',
                label: 'updateOrg',
                disabled: false
            }],
            data: []

        };
    }

    onChangeOrganizationTreeData(data: any) {
        const cur = data.select;
        const type = data.type;
        if (type === 'createOrg') {
            this.organization.id = cur.id;
            this.organization.name = cur.name;
            this.organization.tenantId = cur.tenantId;
            this.isShowAddOrganizationModal = true;
            this.isedit = false;
        }
        if (type === 'updateOrg') {
            this.checkedData = cur;
            this.isShowAddOrganizationModal = true;
            this.isedit = true;
        }
        if (type === 'deleteOrg') {
            this.deleteOrg(cur);
        }
        if (type === 'click') {
            if (cur.id !== 0) {
                this.currOrganization = cur;
            }
        }
    }

    deleteOrg(data: any) {
        const _thiss = this;
        const title = '您确定要删除组织机构“' + data.name + '”吗？';
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: title,
            nzContent: '<strong>说明：其内的用户不会被删除</strong>',
            nzOnOk() {
                const params: any = {};
                params.id = data.id;
                _thiss.service.deleteOrganization(params).then((data: any) => {
                    if (data.success) {
                        _thiss.curId = '';
                        _thiss.reflashOrgData();
                    } else {
                        _thiss.confirmServ.info({
                            nzTitle: data.msg,
                            nzContent: ''
                        });
                    }
                }).catch((err: any) => {
                    console.log(err);
                });
            }
        });


    }

    ngOnInit() {
        this.isloading = true;
        this.initrole();
        this.tenantId = this.activatedRoute.snapshot.params['tenantId'];
        this.queryOrganizationTreeData();
        this.reflashOrgData();
        this.queryTenant();
    }
    queryTenant() {
        this.initrole();
        const params: any = {};
        params.id = this.tenantId;
        this.service.queryTenant(params).then((data: any) => {
            if (data.success) {
                this.tenant = data.data;
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }

    reflashOrgData() {
        this.initrole();
        this.isShowAddOrganizationModal = false;
        const params: any = {};
        params.tenantId = this.tenantId;
        this.service.getOrganizationList(params).then((data: any) => {

            if (data.success === 200) {
                this.queryOrganizationTreeData();
                this.isloading = false;
                if (data.result[0].children && data.result[0].children.length > 0) {
                    // this.isloading = false;
                    data.result[0].children[0].select = true; // 设置第一个默认展示高亮
                    this.organizationTreeData.data = data.result;

                    this.organizationTreeData.data[0].customMenu = [
                        {
                            value: '新建子组织机构',
                            label: 'createOrg',
                            disabled: false
                        }
                    ];
                    this.setMenu(this.organizationTreeData.data[0].children);
                    this.showAdd = false;
                    if (!this.curId) {
                        this.currOrganization = this.organizationTreeData.data[0].children[0];
                    }
                } else {
                    this.showAdd = true;
                }

            }
        }).catch((err: any) => {
            console.log(err);
        });
    }

    reflashOrgDataCur(id: any) {
        this.curId = id;
        this.reflashOrgData();
        this.queryCurOrg(id);
    }
    queryCurOrg(id: any) {
        const param = {
            id: id
        };
        this.service.queryOrganization(param).then((data: any) => {
            if (data.success) {
                this.currOrganization = data.data;
                // this.isVisible = false;
                /* this.onClose.emit(this.isVisible);
                 this.onClose.emit(false);*/
                // this.onSubmit.emit(data.data);
            } else {
                // this.errorCode=data.msg;
                // (data.msg);
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }

    initrole() {
        this.rolecode = window['appConfig'].rolecode;
        if (this.rolecode === 'UM_TENANT_ADMIN') {
            this.tenantId = window['appConfig'].tenant.id;
        }
        // console.dir("rolecode;"+this.rolecode)
        // console.dir("tenantId;"+this.tenantId)
    }

    ngOnDestroy() {

    }


    /**
     * 设置数据的menu
     * @return {[type]} [description]
     */
    private setMenu(data: any) {
        if (data && data.length) {
            data.forEach((item: any) => {
                item.customMenu = [
                    {
                        value: '编辑',
                        label: 'updateOrg',
                        disabled: false
                    },
                    {
                        value: '删除',
                        label: 'deleteOrg',
                        disabled: false
                    },
                    {
                        value: '新建子组织机构',
                        label: 'createOrg',
                        disabled: false
                    }
                ];
                if (item.children && item.children.length) {
                    this.setMenu(item.children);
                }
            });
        }

    }

}

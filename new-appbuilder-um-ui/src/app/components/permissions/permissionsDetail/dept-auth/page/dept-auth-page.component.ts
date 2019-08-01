import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { deptAuthPageService } from './dept-auth-page.service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'dept-auth-page',
    templateUrl: './dept-auth-page.component.html',
    styleUrls: ['./dept-auth-page.component.css'],
    providers: [FormBuilder]
})

export class deptAuthPageComponent implements OnInit {
    initIdFlag: number;
    @Output() onFresh = new EventEmitter<any>();//当编辑/添加完成时向父级输出
    freshNum: number;
    @Input() paramsId: any;
    @Input() listData: any = [];
    @Input() tenantId: any;
    @Input() editOrAdd: boolean = true; // 当true时表示新增，false表示修改
    @Input() nodeData: any; // 点击的节点数据
    @Input() addNode: any; // 新增的父级节点数据
    @Input() addOriData: any; // 新增时要用到的数据

    @Output() editTrue = new EventEmitter<any>(); // 新增完成时传给父级
    @Output() editSucc = new EventEmitter<any>();
    @ViewChild('container') container: ElementRef
    _dataSet: any = [];
    _total: number;
    _pageSize: number = 10;
    _allChecked: boolean;
    _checkList: any = [];
    roleTit: string = '对应角色';
    parentRole: string = '';
    size = 'default';
    options: any = [];
    single: string = '';
    multiple: any = [];
    addChild: boolean = false;
    tag: any = [];
    constructor(private fb: FormBuilder, private confirmServ: NzModalService, private service: deptAuthPageService, private activatedRoute: ActivatedRoute, private router: Router) {

    }


    ngOnInit() {
        let params: any = {};
        params.page = 1;
        params.rows = 9999;
        params.tenantId = this.tenantId;
        this.service.getRole(params).then((data: any) => {
            if (data.data && data.data.length > 0) { // 获取下拉列表数据渲染
                data.data.forEach((item: any) => {
                    item.value = item.name;
                    item.label = item.name;
                    item.disabled = false;
                });
                this.options = data.data;
                this.single = data.data[0].value;
            }

        });

    }
    /**使用复选框**/
    _refreshStatus() {
        const allChecked = this._dataSet.length && this._dataSet.every((value: any) => value.hasAuth === true);
        this._allChecked = allChecked;
    }

    _checkAll(value: boolean) {
        if (value) {
            this._dataSet.forEach((data: any, index: any) => {
                data.hasAuth = true;
            })
        } else {
            this._dataSet.forEach((data: any, index: any) => {
                data.hasAuth = false;
            });
        }
        this._refreshStatus();
    }
    checkData(e: any = null) {
        this._refreshStatus()
    }
    // 新增角色层级
    addRoleLevel(data: any) {
        let tempName = this.options[0]['name'];
        this.single = tempName;
        this._dataSet.forEach((item: any) => {
            item.hasAuth = false;
        });
        console.log('角色数据新增', data);
        this.parentRole = data.origin.name;
        this.checkData();
    }
    ngOnChanges(changes: SimpleChanges) {
        // console.log('changes',changes);
        if (changes.nodeData && changes.nodeData.previousValue != {} && changes.nodeData.previousValue != undefined) { // 切换点击树节点

            // 设置下拉列表默认值
            // 树节点中的名称跟右侧下拉中的角色层级名称不同步，要通过id进行匹配
            // 当前选中节点的角色id
            const treeUmId = changes.nodeData.currentValue.umRoleId;
            this.options.forEach((item: any) => {
                if (item.id == treeUmId) {
                    this.single = item.name;
                }
            });
            // 匹配下拉列表中的操作选项是否被选中
            let tempArr: any = changes.nodeData.currentValue.authBeans || [];
            this._dataSet = tempArr;
            this._total = tempArr.length;
            this.checkData();
        }
        if (changes.listData && changes.listData.currentValue) {
            this._dataSet = changes.listData.currentValue;
            this.checkData();
        }
    }

    // 提交
    handleOk() {
        let params: any = {};
        if (this.editOrAdd) { // 新增时
        // if (!this.nodeData.id) {
            params.authBeans = this._dataSet;
            params.parentCode = null;
            //  console.log('添加的节点',this.addNode);
            if (this.addNode) { // 在节点下新增时
                params.parentCode = this.addNode.code; // 本身的code

            }
            params.name = this.single;
            params.description = '';
            params.tenantId = this.tenantId;
            params.umRoleId = '';
            this.options.forEach((item: any) => { // 下拉项里的id
                if (item.name == this.single) {
                    params.umRoleId = item.id;
                }
            });
            params.roleHierarchyId = this.addOriData.id; // 列表跳转过来的
            // console.log('新增提交的数据', params);
            this.service.addRoleLevel(params).then((data: any) => {
                if (data['code'] === 200) {
                    this.editOrAdd = false;
                    this.addChild = false;
                    this.editTrue.emit(this.single);
                    this.confirmServ.warning({
                        nzTitle: '新增成功',
                        nzOnCancel: () => {
                        }
                    });

                } else {
                    this.confirmServ.warning({
                        nzTitle: data.message,
                        nzOnCancel: () => {
                        }
                    });
                }
            });
        } else { // 编辑时
            params.id = this.nodeData.id;
            params.name = this.single;
            params.description = this.nodeData.description;
            params.parentCode = this.nodeData.parentCode;
            params.tenantId = this.nodeData.tenantId;
            this.options.forEach((item: any) => { // 下拉项里的id
                console.log('this.single', this.single);
                if (item.name === this.single) {
                    params.umRoleId = item.id;
                }
            });
            const temp: any = {};
            params.authBeans = this._dataSet;
            params.roleHierarchyId = this.nodeData.roleHierarchyId;
            this.service.editRoleLevel(params).then((data: any) => {
                if (data['code'] === 200) {
                    this.confirmServ.warning({
                        nzTitle: '修改成功',
                        nzOnCancel: () => {
                        }
                    });
                    this.editSucc.emit();
                } else {
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

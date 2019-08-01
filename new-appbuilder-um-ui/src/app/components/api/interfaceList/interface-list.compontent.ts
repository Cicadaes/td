import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { ApiService } from '../api.service';
import * as _ from 'lodash';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';


@Component({
    selector: 'app-interface-list',
    templateUrl: './interface-list.compontent.html',
    styleUrls: ['./interface-list.compontent.css']
})
export class InterfaceListComponent implements OnInit {
    interfaceArray: any = [
        {
            id: 1,
            fieldName: 'name',
            fieldLabel: '接口名称',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'syncType',
            fieldLabel: '通讯方式',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [
                { label: '全部', value: '' },
                { label: '同步', value: '1' },
                { label: '异步', value: '2' }
            ]
        }, {
            id: 3,
            fieldName: 'versionName',
            fieldLabel: '接口版本',
            fieldType: 'input'
        }
    ];
    queryParams: any;
    currentApp: any;
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    interfaceData: any = [];
    loading = true;
    addFlag = false;
    editFlag: any = 'add';
    editData: any;
    pDataList: any = [];
    _productList: any;
    _nowData: any;
    operationInterfaceObj: any;
    catalogId: any;
    @Output() operationInterface = new EventEmitter<any>();
    @Input() set nowData(value: any) {
        this._nowData = value;
        this.queryParams = {};
        if (this._nowData.label) {
            this.queryParams['catalogId'] = this._nowData.value;
            this.catalogId = this._nowData.value;
        } else {
            this._nowData.value = '';
            this.catalogId = '';
        }
        this.refreshData(true);
    }
    constructor(
        private service: ApiService,
        private scrollSer: ScrollToTopService,
        private modalService: NzModalService,
        private notificationService: NzNotificationService) {
    }

    ngOnInit() { }

    // 设置处理tree的节点数据
    setTreeData(node: any) {
        node.label = node.name;
        node.value = node.id;
        if (!node.children) {
            node.children = [];
        }
        if (node.children.length < 1) {
            return;
        } else {
            for (let i = 0; i < node.children.length; i++) {
                this.setTreeData(node.children[i]);
            }
        }
    }

    // 牧户查询各项
    onSearchInterfaceList(params: any) {
        this.queryParams = {};
        for (const key in params) {
            if (params[key] !== null && params[key] !== '') {
                this.queryParams[key] = params[key];
            }
        }
        this.refreshData(true);
    }

    // 查询接口列表
    refreshData(reset = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const params = this.queryParams || {};
        if (this.catalogId) {
            params['catalogId'] = this.catalogId;
        }

        params.page = this.pageIndex;
        params.pageSize = this.pageSize;

        this.service.getInterfaceList(params).then((data: any) => {
            if (data.code === 200) {
                this.loading = false;
                this.interfaceData = [];
                this.total = data.data.total;
                data.data.data.forEach((one: any) => {
                    if (one.status === '1' || one.status === 1) {
                        one.copyStatus = true;
                    } else {
                        one.copyStatus = false;
                    }

                    this.interfaceData.push(one);
                });
                this.scrollSer.scrollToTop();
            }
        }).catch((err: any) => {
        });
    }

    // 新增接口
    addInterface() {
        this.operationInterfaceObj = {};
        this.operationInterfaceObj['add'] = 'add';
        this.operationInterfaceObj['obj'] = {};
        this.operationInterfaceObj.obj = this._nowData.obj;
        this.operationInterface.emit(this.operationInterfaceObj);
    }

    // 查看
    detail(one: any) {
        this.operationInterfaceObj = {};
        this.operationInterfaceObj['add'] = 'see';
        this.operationInterfaceObj['obj'] = one;
        this.operationInterface.emit(this.operationInterfaceObj);
    }

    // 编辑
    edit(one: any) {
        this.operationInterfaceObj = {};
        this.operationInterfaceObj['add'] = 'edit';
        this.operationInterfaceObj['obj'] = one;
        this.operationInterface.emit(this.operationInterfaceObj);
    }

    // 删除
    delete(one: any) {
        const that = this;
        if (one.status === 1) {
            this.modalService.warning({
                nzTitle: `请先下线接口${one.name}再进行删除`,
                nzOkText: '知道了'
            });
        } else {
            this.modalService.confirm({
                nzMaskClosable: false,
                nzTitle: `<div class='one' title='${one.name}'>你确定要删除接口${one.name}吗？<div>`,
                nzContent: '删除后无法恢复，你还要继续吗？',
                nzOnOk: () => {
                    that.service.deleteInterface(one.id).then((data: any) => {
                        if (data.code === 200) {
                            that.loading = true;
                            that.refreshData(true);
                        } else {
                            this.notificationService.create('warning', '错误提示', data.message);
                        }
                    }).catch((err: any) => {
                    });
                }
            });
        }
    }

    // 复制
    copy(one: any) {
        this.operationInterfaceObj = {};
        this.operationInterfaceObj['add'] = 'copy';
        this.operationInterfaceObj['obj'] = {};
        this.operationInterfaceObj.obj = one;
        this.operationInterface.emit(this.operationInterfaceObj);

    }

    // 改变接口状态
    changeStatus(value: any, item: any) {
        const that = this;
        let title, content;
        if (item.status === 1 || item.status === '1') {
            title = `你确定要下线接口${item.name}的${item.versionName}版本吗？`;
            content = `下线后用户将无法查看此接口版本的使用帮助，你还要继续吗？`;
        } else {
            title = `你确定要发布接口${item.name}的${item.versionName}版本吗？`;
            content = `发布后用户将能查看到此接口版本的使用帮助，你还要继续吗？`;
        }

        this.modalService.confirm({
            nzTitle: title,
            nzContent: content,
            nzOnOk: () => {
                const obj = {};
                obj['id'] = item.id;
                obj['catalogId'] = item.catalogId;
                obj['versionId'] = item.versionId;
                obj['versionName'] = item.versionName;
                obj['status'] = item.status ? 0 : 1;
                that.service.updateInterface(obj).then((data: any) => {
                    if (data.code === 200) {
                        that.loading = true;
                        that.refreshData(true);
                    } else {
                        this.notificationService.create('warning', '错误提示', data.message);
                    }
                }).catch((err: any) => {
                });
            }
        });
    }
}

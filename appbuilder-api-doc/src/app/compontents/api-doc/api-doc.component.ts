import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiDocService } from './api-doc.service';
import { NzNotificationService, NzTreeNode, NzFormatEmitEvent } from 'ng-cosmos-ui';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'app-api-doc',
    templateUrl: './api-doc.component.html',
    styleUrls: ['./api-doc.component.css']
})
export class ApiDocComponent implements OnInit {
    @ViewChild('apiLeft') apiLeft: ElementRef;
    @ViewChild('apiCenter') apiCenter: ElementRef;
    apiFlag = true;
    viewHeight = 1;
    flag = false;                        // 分类的弹框
    productList: any = [];               // 产品分类列表
    _interfaceDetailDate: any = {};      // 接口详情
    _requestHeadersTable: any = [];      // 请求header
    _requestQueryTable: any = [];
    _requestBodyTable: any = [];
    _responseHeadersTable: any = [];     // 返回header
    _responseSuccessTable: any = [];
    _responseFailTable: any = [];
    _codeTable: any = [];
    htmlRequestBody: any;                // 请求参数body示例
    htmlResponseSuccess: any;            // 成功返回body示例
    htmlResponseFail: any;               // 失败返回body示例
    parmasStr: any;                      // 完整的请求地址
    apiId: any;                          // apiId 用于判断当前状态是否为查看api详情  若无，则取默认值
    nowDate: any;                        // 切换产品分类时当前选中的产品分类
    catalogsItem: any = {};              // 二级分类对应的父分类
    item: any = {};                      // 当前选中的二级分类
    selectedVersion: any;                // 当前选中的版本Id
    versionList: any = [];               // 版本列表
    inrefaceList: any = [];              // 接口列表
    expandKeys = [];                     // 默认展开的一级分类
    nodes = [];                          // 产品分类树
    catalogId: any;                      // 当前选中的二级产品分类Id
    path: any;
    name: any;
    _requestBodyType: any;
    expandDataCache: any;
    navList: any = [
        {
            name: '接口简介',
            id: 2
        },
        {
            name: '请求参数',
            id: 3,
            children: [
                {
                    name: 'Headers',
                    id: 5,
                },
                {
                    name: 'Query',
                    id: 6,
                },
                {
                    name: 'Body',
                    id: 7,
                },
                {
                    name: '请求示例',
                    id: 8,
                }
            ]
        },
        {
            name: '返回结果',
            id: 4,
            children: [
                {
                    name: 'Headers',
                    id: 9,
                },
                {
                    name: '正常返回',
                    id: 10,
                },
                {
                    name: '失败返回',
                    id: 11,
                },
                {
                    name: '返回码',
                    id: 12,
                }
            ]
        },
    ];
    constructor(
        private service: ApiDocService,
        private notification: NzNotificationService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.path = params['path'];
            console.log(this.path);
            this.name = params['name'];
            this.apiId = Number(params['apiId']);
            this.catalogId = Number(params['catalogId']);
            if (this.path) {
                this.getOneApi();
            } else if (this.apiId) {
                this.getProductList();
                this.getInterfaceDetail(this.apiId, 'yes');
            } else {
                this.getProductList();
            }
        });
    }

    getOneApi() {
        this.service.getOneApi({ name: this.name, catalogId: this.catalogId, path: this.path}).subscribe((response: any) => {
            if (response.code === 200) {
                this._interfaceDetailDate = response.data;
                if (this._interfaceDetailDate && !this._interfaceDetailDate.status) {
                    this.apiFlag = false;
                    return;
                }
                this.apiId = this._interfaceDetailDate.id;
                this.catalogId =  this._interfaceDetailDate.catalogId;
                this.selectedVersion = this._interfaceDetailDate.versionId;
                this.getProductList();
            }
        });
    }


    goTo(location: string): void {
        window.location.hash = '';
        window.location.hash = location;
    }

    getHeight() {
        if (this.apiLeft && this.apiCenter) {
            this.apiLeft.nativeElement.offsetHeight > this.apiCenter.nativeElement.offsetHeight
                ? this.viewHeight = 1 : this.viewHeight = 2;
        }
    }

    // 点击树节点,显示详情
    showDetail(e: NzFormatEmitEvent): void {
        if (e.node.level) {
            this.nowDate = e.node;
            this.flag = false;
            this.item = e.node.origin;
            this.catalogsItem = e.node.parentNode.origin;
            this.getVersionList(e.node.parentNode.key, 'change');
        }
    }

    // 弹出产品分类弹框
    change() {
        this.flag = !this.flag;
    }

    // 初始化查询接口详情的返回参数
    initResponse() {
        this._requestHeadersTable = [];
        this._requestQueryTable = [];
        this._requestBodyTable = [];
        this._responseHeadersTable = [];
        this._responseSuccessTable = [];
        this._responseFailTable = [];
        this._codeTable = [];
        this.htmlRequestBody = null;
        this.htmlResponseSuccess = null;
        this.htmlResponseFail = null;
        this.parmasStr = null;
    }

    // 获取当前接口的详情信息
    getInterfaceDetail(id: any, type: any) {
        this.service.getInterfaceDetail(id).subscribe((response: any) => {
            if (response.code === 200) {
                this._interfaceDetailDate = _.cloneDeep(response.data);
                if (this.navList[0].id === 1) {
                    this.navList[0].name = this._interfaceDetailDate.name;
                } else {
                    this.navList.unshift({
                        name: this._interfaceDetailDate.name,
                        id: 1
                    });
                }
                this.initResponse();
                if (this._interfaceDetailDate.requestParamVos) {
                    if (this._interfaceDetailDate.requestParamVos[0].body) {
                        this._requestBodyTable = this._interfaceDetailDate.requestParamVos[0].body.bodyParams;
                        this._requestBodyType = this._interfaceDetailDate.requestParamVos[0].body.bodyType;
                    }
                    if (this._interfaceDetailDate.requestParamVos[0].header) {
                        this._requestHeadersTable = this._interfaceDetailDate.requestParamVos[0].header;
                    }
                    if (this._interfaceDetailDate.requestParamVos[0].query) {
                        this._requestQueryTable = this._interfaceDetailDate.requestParamVos[0].query;
                        this.parmasStr = this.service.getParams(this.setValue(this._requestQueryTable));
                    }
                }

                if (this._interfaceDetailDate.responseParamVos) {
                    if (this._interfaceDetailDate.responseParamVos[0].success) {
                        this._responseSuccessTable = this._interfaceDetailDate.responseParamVos[0].success;
                    }
                    if (this._interfaceDetailDate.responseParamVos[0].fail) {
                        this._responseFailTable = this._interfaceDetailDate.responseParamVos[0].fail;
                    }
                    if (this._interfaceDetailDate.responseParamVos[0].headers) {
                        this._responseHeadersTable = this._interfaceDetailDate.responseParamVos[0].headers;
                    }
                }

                if (this._interfaceDetailDate.responseSucSample) {
                    this.htmlResponseSuccess = JSON.stringify(JSON.parse(this._interfaceDetailDate.responseSucSample), null, 4)
                        .replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
                }
                if (this._interfaceDetailDate.responseFailSample) {
                    this.htmlResponseFail = JSON.stringify(JSON.parse(this._interfaceDetailDate.responseFailSample), null, 4)
                        .replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
                }
                if (this._interfaceDetailDate.requestSample) {
                    this.htmlRequestBody = JSON.stringify(JSON.parse(this._interfaceDetailDate.requestSample), null, 4)
                        .replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
                }
                this.expandDataCache = {};
                this.setTable('resquestBody', this._requestBodyTable);
                this.setTable('responseSuccess', this._responseSuccessTable);
                this.setTable('responseFail', this._responseFailTable);

                // 返回码数据展示
                if (this._interfaceDetailDate.responseCodes) {
                    this._codeTable = this._interfaceDetailDate.responseCodes;
                }
                if (type === 'yes') {
                    this.apiId = id;
                    this.selectedVersion = this._interfaceDetailDate.versionId;
                }
                this.getHeight();
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 循环设置树型teble的数据结构
    setTable(souce: any, arr: any) {
        const that = this;
        arr.forEach((item: any) => {
            that.expandDataCache[souce + item.paramName] = that.convertTreeToList(item, souce);
        });
    }

    // 循环设置树型teble的数据结构
    convertTreeToList(root: any, souce: any) {
        const stack = [], array: any = [], hashMap = {};
        stack.push({ ...root, level: 0, expand: true });
        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array, souce);
            if (node.child) {
                for (let i = node.child.length - 1; i >= 0; i--) {
                    stack.push({ ...node.child[i], level: node.level + 1, expand: true, parent: node });
                }
            }
        }
        return array;
    }

    // 循环设置树型teble的数据结构
    visitNode(node: any, hashMap: any, array: any, souce: any) {
        if (!hashMap[souce + node.paramName]) {
            hashMap[souce + node.paramName] = true;
            array.push(node);
        }
    }

    // 设置json格式的数据
    setValue(list: any) {
        const obj = {};
        list.forEach((item: any) => {
            obj[item.paramName] = item.paramExample || '';
        });
        return obj;
    }

    // 设置处理tree的节点数据
    setTreeData(node: any) {
        node.title = node.name;
        node.key = node.id;
        if (this.catalogId && node.id === this.catalogId) {
            this.item = node;
        }
        if (!node.children || (node.children && node.children.length < 1)) {
            node.isLeaf = true;
            return;
        } else {
            for (let i = 0; i < node.children.length; i++) {
                this.setTreeData(node.children[i]);
            }
        }
    }

    // 获取产品分类列表
    getProductList() {
        this.service.getProductList().subscribe((response: any) => {
            if (response.code === 200) {
                this.nodes = [];
                this.productList = response.data;
                this.productList.forEach((item: any, index: any) => {
                    this.setTreeData(item);
                    this.expandKeys.push(item.id);
                    this.nodes.push(new NzTreeNode(item));
                });
                if (this.apiId) {
                    this.productList.forEach((item: any, index: any) => {
                        if (item.id === this.item.parentId) {
                            this.catalogsItem = item;
                        }
                    });
                } else {
                    if (this.productList && this.productList.length) {
                        this.productList.forEach((item: any, index: any) => {
                            if (item.children && item.children.length) {
                                if (!this.catalogsItem['id']) {
                                    this.catalogsItem = item;
                                    this.item = item.children[0];
                                }
                            }
                        });
                    }
                }
                if (this.catalogsItem && this.catalogsItem.id) {
                    this.getVersionList(this.catalogsItem.id, '');
                }
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 获取接口列表
    getInterfaceList(parmas: any, type: any) {
        this.service.getInterfaceList(parmas).subscribe((response: any) => {
            if (response.code === 200) {
                this.inrefaceList = [];
                this.inrefaceList = response.data.data;
                if (this.inrefaceList.length) {
                    if (!this.apiId) {
                        this.apiId = this.inrefaceList[0].id;
                    } else {
                        if (type === 'change') {
                            this.apiId = this.inrefaceList[0].id;
                        }
                    }
                    this.getInterfaceDetail(this.apiId, 'no');
                } else {
                    this._interfaceDetailDate = {};
                }
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 获取版本列表
    getVersionList(catalogId: any, type: any) {
        this.service.getVersionList(catalogId).subscribe((response: any) => {
            if (response.code === 200) {
                this.versionList = response.data.data;
                if (this.versionList.length) {
                    if (!this.apiId || type === 'change') {
                        this.selectedVersion = this.versionList[0].id;
                    }
                    this.getInterfaceList({ versionId: this.selectedVersion, catalogId: this.item.id, page: 1,
                        pageSize: 99999, status: 1 }
                        , type);
                }
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 切换版本
    changeVersion(value: any) {
        this.getInterfaceList({ versionId: value, catalogId: this.item.id, page: 1, pageSize: 99999, status: 1 }, 'change');
    }
}

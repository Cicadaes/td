import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { ApiService } from '../../api.service';
import * as _ from 'lodash';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-see-interface',
    templateUrl: './see-interface.component.html',
    styleUrls: ['./see-interface.component.css']
})
export class SeeInterfaceComponent implements OnInit, OnChanges {
    _interfaceDetailDate: any = {};
    _requestHeadersTable: any = [];
    _requestQueryTable: any = [];
    _requestBodyTable: any = [];
    _responseHeadersTable: any = [];
    _responseSuccessTable: any = [];
    _responseFailTable: any = [];
    _codeTable: any = [];

    expandDataCache = {};
    htmlRequestBody: any;        // 请求参数body
    htmlResponseSuccess: any;    // 成功返回body
    htmlResponseFail: any;       // 失败返回body

    parentItem: any = {};
    item: any = {};

    parmasStr: any;              // 完整的请求地址

    @Output() toEdit = new EventEmitter<any>();
    _requestBodyType: any;

    @Input() set interfaceDetailDate(value: any) {
        if (value) {
            this._interfaceDetailDate = _.cloneDeep(value);
            this.catalogList();

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
                    this.parmasStr = this.apiService.getParams(this.setValue(this._requestQueryTable));
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

            // 返回参数展示
            this.setTable('responseSuccess', this._responseSuccessTable);
            this.setTable('responseFail', this._responseFailTable);

            // 返回码数据展示
            if (this._interfaceDetailDate.responseCodes) {
                this._codeTable = this._interfaceDetailDate.responseCodes;
            }


        }
    }

    constructor(
        private apiService: ApiService,
        private notification: NzNotificationService,
        private modalService: NzModalService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    setValue(list: any) {
        const obj = {};
        list.forEach((item: any) => {
            obj[item.paramName] = item.paramExample || '';
        });
        return obj;
    }

     // 查询产品列表
     catalogList() {
        this.apiService.getAllProductList().then((response: any) => {
            if (response.code === 200) {
                let parentId: any;
                response.data.data.forEach((one: any) => {
                    if (one.id === this._interfaceDetailDate.catalogId) {
                        parentId = one.parentId;
                        this.item = one;
                    }
                });
                response.data.data.forEach((one: any) => {
                    if (one.id === parentId) {
                        this.parentItem = one;
                    }
                });
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

    visitNode(node: any, hashMap: any, array: any, souce: any) {
        if (!hashMap[souce + node.paramName]) {
            hashMap[souce + node.paramName] = true;
            array.push(node);
        }
    }


    // 修改当前解耦状态
    clickSwitch(data: any) {
        const that = this;
        let title, content;
        if (data.status === 1 || data.status === '1') {
            title = `你确定要下线接口${data.name}的${data.versionName}版本吗？`;
            content = `下线后用户将无法查看此接口版本的使用帮助，你还要继续吗？`;
        } else {
            title = `你确定要发布接口${data.name}的${data.versionName}版本吗？`;
            content = `发布后用户将能查看到此接口版本的使用帮助，你还要继续吗？`;
        }
        this.modalService.confirm({
            nzTitle: title,
            nzContent: content,
            nzOnOk: () => {
                const obj = {};
                obj['id'] = data.id;
                obj['catalogId'] = data.catalogId;
                obj['versionId'] = data.versionId;
                obj['versionName'] = data.versionName;
                obj['status'] = data.status ? data['status'] = 0 : data['status'] = 1;
                that.apiService.updateInterface(obj).then((response: any) => {
                    if (response.code !== 200) {
                        this.notification.create('warning', '错误提示', response.message);
                    } else {
                        this._interfaceDetailDate.status = obj['status'];
                        data.status = data.status ? data['status'] = 1 : data['status'] = 0;
                    }
                }).catch((err: any) => {
                });
            },
            nzOnCancel: () => { }
        });
    }

    // 去编辑界面
    goEdit() {
        const obj = {
            obj: this._interfaceDetailDate,
            flag: 'update'
        };
        this.toEdit.emit(obj);
    }

}

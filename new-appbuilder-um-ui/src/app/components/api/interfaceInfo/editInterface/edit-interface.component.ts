import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../api.service';
import * as _ from 'lodash';
import { NzNotificationService, NzMessageService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-edit-interface',
    templateUrl: './edit-interface.component.html',
    styleUrls: ['./edit-interface.component.css']
})
export class EditInterfaceComponent implements OnInit {
    @Output() toSee = new EventEmitter<any>();
    isLoading: boolean;
    @Input() set interfaceDetailDate(value: any) {
        if (value) {
            this.editData = value;
            if (this.editData.requestMethod) {
                this.selectedRequestMethod = this.editData.requestMethod;
            }

            this.uriList = [{ name: '无', id: '' }];
            if (this.editData.uri) {
                this.uriList.push({ name: this.editData.uri, id: this.editData.uri });
                this.selecteUri = this.editData.uri;
            } else {
                if (this.editData.versionId) {
                    this.getUriLIst(this.editData.versionId);
                }
            }

            if (this.editData.syncType) {
                this.syncType = this.editData.syncType.toString();
            }

            if (this.editData.status) {
                this.status = this.editData.status.toString();
            }

            this.path = this.editData.path;

            if (this.editData.summary) {
                this.summary = this.editData.summary;
            }

            if (this.editData.service) {
                this.selectedService = this.editData.service;
            }

            if (this.editData.requestParamVos) {
                if (this.editData.requestParamVos[0].body) {
                    this.requestBodyType = this.editData.requestParamVos[0].body.bodyType;

                    if (this.requestBodyType === 'json') {
                        this.requestBodyList = this.editData.requestParamVos[0].body.bodyParams;
                    } else {
                        this.requestBodyList2 = this.editData.requestParamVos[0].body.bodyParams;
                    }
                }

                if (this.editData.requestParamVos[0].header) {
                    this.requestHeaderList = this.editData.requestParamVos[0].header;
                }

                if (this.editData.requestParamVos[0].query) {
                    this.requestQueryList = this.editData.requestParamVos[0].query;
                }
            }

            if (this.editData.responseParamVos) {
                if (this.editData.responseParamVos[0].success) {
                    this.responseSuccessList = this.editData.responseParamVos[0].success;
                }

                if (this.editData.responseParamVos[0].fail) {
                    this.responseFailList = this.editData.responseParamVos[0].fail;
                }

                if (this.editData.responseParamVos[0].headers) {
                    this.responseHeaderList = this.editData.responseParamVos[0].headers;
                }
            }

            this.responseCodeList = this.editData.responseCodes;

            if (this.editData.responseSucSample) {
                this.htmlResponseSuccess = JSON.stringify(JSON.parse(this.editData.responseSucSample), null, 4)
                .replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
                this.responseSucSample = this.editData.responseSucSample;
            }

            if (this.editData.responseFailSample) {
                this.htmlResponseFail = JSON.stringify(JSON.parse(this.editData.responseFailSample), null, 4)
                .replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
                this.responseFailSample = this.editData.responseFailSample;
            }

            if (this.editData.requestSample) {
                this.htmlRequestBody = JSON.stringify(JSON.parse(this.editData.requestSample), null, 4)
                .replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
                this.requestSample = this.editData.requestSample;
            }

            this.catalogList();
            this.getService('search');
        }
    }

    @Input() flag: any;
    @ViewChild('elementRequestBody') elementRequestBody: ElementRef;
    @ViewChild('elementResponseSuccess') elementResponseSuccess: ElementRef;
    @ViewChild('elementResponseFail') elementResponseFail: ElementRef;
    addCodeFlag = false;
    editData: any = {};                     // 传递过来的接口先关数据
    editFlag: any;                          // 判断当前是编辑状态还是新建状态
    syncType = '1';                         // 通讯方式 1：同步    2：异步
    status = '0';                           // 接口状态 0：未发布  1：已发布
    selectedService: any;                   // 所属服务
    serviceList: any = [];                  // Uri列表
    summary: any = null;                    // 接口简介
    parentItem: any = {};
    item: any = {};
    page = 1;                               // 请求所属服务的参数
    pageSize = 10;                          // 请求所属服务的参数
    selectedRequestMethod: any = 'GET';     // 请求方式
    requestMethodList: any = [
        { name: 'GET' },
        { name: 'POST' },
        { name: 'PUT' },
        { name: 'DELETE' },
        { name: 'HEAD' },
        { name: 'OPTIONS' },
        { name: 'PATCH' }
    ];
    selectedDomainId: any;                  // 域名选终止
    domainList: any = [];                   // 域名下拉列表
    selectedDomainIdError = false;          // 用于添加样式
    selecteUri: any = '';                   // 当前选中Uri
    uriList: any = [];                      // Uri列表
    path: any = null;
    requestHeaderList: any = [];            // 请求参数的设置  -- header list
    requestBodyType = 'json';               // 请求参数body type
    requestBodyList: any = [];              // 请求参数的设置  -- body list json类型
    requestBodyList2: any = [];             // 请求参数的设置  -- body list form类型
    requestQueryList: any = [];             // 请求参数的设置  -- query list
    responseHeaderList: any = [];           // 返回参数的设置  -- header list
    responseSuccessList: any = [];          // 返回参数的设置  -- 正常返回 list
    responseFailList: any = [];             // 返回参数的设置  -- 失败返回 list
    responseCodeList: any = [];             // 返回参数的设置  -- 返回码 list
    // 实例数据参数
    htmlRequestBody: any;                   // 请求参数的设置  -- body list
    htmlResponseSuccess: any;               // 返回参数的设置  -- success list
    htmlResponseFail: any;                  // 返回参数的设置  -- fail list
    responseSucSample: any;
    responseFailSample: any;
    requestSample: any;

    constructor(
        private apiService: ApiService,
        private notification: NzNotificationService,
        private message: NzMessageService
    ) { }

    ngOnInit() {
    }

    // 查询产品列表
    catalogList() {
        this.apiService.getAllProductList().then((response: any) => {
            if (response.code === 200) {
                let parentId: any;
                response.data.data.forEach((one: any) => {
                    if (one.id === this.editData.catalogId) {
                        parentId = one.parentId;
                        this.item = one;
                    }
                });
                response.data.data.forEach((one: any) => {
                    if (one.id === parentId) {
                        this.parentItem = one;
                    }
                });
                this.getDomainList(parentId);
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 获取产品下域名
    getDomainList(catalogId: any) {
        this.apiService.getDomainName({ catalogId: catalogId }).then((response: any) => {
            if (response.code === 200) {
                this.domainList = response.data.data;
                if (this.editData.domainId) {
                    this.selectedDomainId = this.editData.domainId;
                } else {
                    if (this.domainList.length) {
                        this.selectedDomainId = this.domainList[0].id;
                    }
                }
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 过去版本Uri
    getUriLIst(versionId: any) {
        this.apiService.getVersionDetail(versionId).then((response: any) => {
            if (response.code === 200) {
                if (response.data && response.data.uri) {
                    this.uriList.push({ name: response.data.uri, id: response.data.uri });
                    this.selecteUri = response.data.uri;
                }
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 获取所属服务
    getService(type: any) {
        this.apiService.getService({}).then((response: any) => {
            if (response.code === 200) {
                this.isLoading = false;
                this.serviceList = response.data.data;
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 添加参数
    addParmas(type: any, list: any) {
        const obj = {};
        obj['requireType'] = 'yes';
        obj['level'] = 1;
        if (type === 'resquestHeader') {
            this.requestHeaderList.push(obj);
        } else if (type === 'resquestBody') {
            obj['paramType'] = 'string';
            if (this.requestBodyType === 'json') {
                this.requestBodyList.push(obj);
            } else {
                this.requestBodyList2.push(obj);
            }
        } else if (type === 'resquestQuery') {
            obj['paramType'] = 'string';
            this.requestQueryList.push(obj);
        } else if (type === 'responseHeader') {
            this.responseHeaderList.push(obj);
        } else if (type === 'responseSuccess') {
            obj['paramType'] = 'string';
            this.responseSuccessList.push(obj);
        } else if (type === 'responseFail') {
            obj['paramType'] = 'string';
            this.responseFailList.push(obj);
        }
    }

    // 删除参数
    removeParmas(type: any, list: any, index: any) {
        list.splice(index, 1);
    }

    // 生成数据实例
    dataExample(list: any, type: any) {
        const arr = _.cloneDeep(list);
        const html = this.setValue(arr);
        if (type === 'resquestBody') {
            this.htmlRequestBody = '';
            setTimeout(() => {
                this.htmlRequestBody = JSON.stringify(html, null, 4).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
            }, 100);
            this.requestSample = JSON.stringify(html);
        } else if (type === 'responseSuccess') {
            this.htmlResponseSuccess = '';
            setTimeout(() => {
                this.htmlResponseSuccess = JSON.stringify(html, null, 4).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
            }, 100);
            this.responseSucSample = JSON.stringify(html);
        } else if (type === 'responseFail') {
            this.htmlResponseFail = '';
            setTimeout(() => {
                this.htmlResponseFail = JSON.stringify(html, null, 4).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
            }, 100);
            this.responseFailSample = JSON.stringify(html);
        }
    }

    // 设置json数据
    setValue(list: any) {
        const obj = {};
        list.forEach((item: any) => {
            if (!item.paramName) {
                return;
            }
            obj[item.paramName] = this.setHtml(item);
        });
        return obj;
    }

    // 设置json数据格式
    setHtml(obj: any) {
        let temp_value: any;
        switch (obj.paramType) {
            case 'string':
            case 'integer':
            case 'boolean':
            case 'file':
                temp_value = obj.paramExample || '';
                break;
            case 'object':
                temp_value = {};
                if (obj.child) {
                    obj.child.forEach((item: any) => {
                        temp_value[item.paramName] = this.setHtml(item);
                    });
                }
                break;
            case 'array':
                temp_value = [];
                if (obj.child) {
                    obj.child.forEach((item: any) => {
                        temp_value.push(this.setHtml(item));
                    });
                }
                break;
            default:
                break;
        }
        return temp_value;
    }

    // 添加已有返回码
    addCode() {
        this.addCodeFlag = true;
    }

    hideCodeDialog($event: any) {
        this.addCodeFlag = false;
    }

    // 保存新建、编辑分类弹框
    saveCode($event: any) {
        this.addCodeFlag = false;
        const obj = {};
        this.responseCodeList.forEach( (one: any) => {
            obj[one.id] = one;
        });

        $event.forEach( (item: any) => {
            if (!obj[item.id]) {
                this.responseCodeList.push(item);
            }
        });
    }

    // 确定新建接口
    confirm() {
        if (this.domainChange(this.selectedDomainId)) {
            this.message.create('error', `域名前缀不能为空，请先添加域名前缀`);
            return;
        }

        if (this.path) {
            const rex = /^[0-9a-zA-Z-\.\&\?\=\:\#\{\}\_\/]{2,100}$/;
            if (!(rex.test(this.path))) {
                this.message.create('error', `接口地址URI格式错误：只能输入数字、26个英文字母（大小写）、“:/?&#-_{}.”，长度最少2个字符，最多100个字符`);
                return ;
            }
        } else {
            this.message.create('error', `请将接口路径补充完整`);
            return;
        }

        let text = '求参数-Body-Json格式中至少要配置一个参数';
        let arr = _.cloneDeep(this.requestBodyList);
        let type = 'json';
        // 判断接口的请求方式
        if (this.selectedRequestMethod === 'PUT' || this.selectedRequestMethod === 'POST'
            || this.selectedRequestMethod === 'DELETE' || this.selectedRequestMethod === 'PATCH') {
            if (this.requestBodyType !== 'json') {
                text = '求参数-Body-Form格式中至少要配置一个参数';
                arr = _.cloneDeep(this.requestBodyList2);
                type = 'form';
            }

            if (this.checkError(arr, 'json', 'name')) {
                this.message.create('error', `请检查标红项，只能输入英文字母、数字及‘-_.’，最少1位字符、最多128位字符，名称前后必须是英文字母`);
                return;
            }
            if (this.checkError(arr, 'json', 'paramExample') || this.checkError(arr, 'json', 'comment')) {
                this.message.create('error', `请检查标红项，长度不能超过256个字符`);
                return;
            }
            if (this.checkRequired(arr, text)) {
                return;
            }
        }

        if (this.checkError(this.responseSuccessList, 'json', 'name')
            || this.checkError(this.responseFailList, 'json', 'name')
            || this.checkError(this.requestHeaderList, 'json', 'name')
            || this.checkError(this.requestQueryList, 'json', 'name')
            || this.checkError(this.responseHeaderList, 'json', 'name')
        ) {
            this.message.create('error', `请检查标红项，只能输入英文字母、数字及‘-_.’，最少1位字符、最多128位字符，名称前后必须是英文字母`);
            return;
        }

        if (this.checkError(this.responseSuccessList, 'json', 'paramExample')
            || this.checkError(this.responseFailList, 'json', 'paramExample')
            || this.checkError(this.requestHeaderList, 'json', 'paramExample')
            || this.checkError(this.requestQueryList, 'json', 'paramExample')
            || this.checkError(this.responseHeaderList, 'json', 'paramExample')
            || this.checkError(this.responseSuccessList, 'json', 'comment')
            || this.checkError(this.responseFailList, 'json', 'comment')
            || this.checkError(this.requestHeaderList, 'json', 'comment')
            || this.checkError(this.requestQueryList, 'json', 'comment')
            || this.checkError(this.responseHeaderList, 'json', 'comment')
        ) {
            this.message.create('error', `请检查标红项，长度不能超过256个字符`);
            return;
        }

        if (this.checkRequired(this.responseSuccessList, '返回结果-正常返回中至少要配置一个参数')
            || this.checkRequired(this.responseFailList, '返回结果-失败返回中至少要配置一个参数')
            || this.checkRequired(this.responseCodeList, '返回结果-返回码中至少要配置一个参数')) {
            return;
        }

        if (!this.summary || this.summary.length < 10 || this.summary.length > 10000) {
            this.message.create('error', `简介参数是必填项，最少输入10个字符，最多10000个字符`);
            return;
        }

        this.packageParmas();
    }

    // 取消
    cancel() {
        const obj = { flag: 'see', data: this.editData };
        this.toSee.emit(obj);
    }

    // 当输入值的时候取消错误提示
    changeItemError(item: any) {
        if (item.error) {
            delete item.error;
        }
    }

    changeItem(item: any, key: any) {
        if (item[key]) {
            delete item[key];
        }
    }

    // 组装参数
    packageParmas() {
        const data = _.assign({}, this.editData);
        data.requestMethod = this.selectedRequestMethod;
        data.domainId = this.selectedDomainId;
        data.path = this.path;
        data.syncType = Number(this.syncType);
        data.status = Number(this.status);
        data.summary = this.summary;

        if (this.selectedService) {
            data.service = this.selectedService;
        }

        if (this.selecteUri) {
            data.uri = this.selecteUri;
        }

        if (this.requestBodyList.length || this.requestBodyList2.length || this.requestHeaderList.length || this.requestQueryList.length) {
            data.requestParamVos = [{}];
        }

        if (this.requestBodyList.length || this.requestBodyList2.length) {
            data.requestParamVos[0]['body'] = {};
            data.requestParamVos[0]['body']['bodyType'] =  this.requestBodyType;
            if (this.requestBodyType === 'json') {
                data.requestParamVos[0]['body']['bodyParams'] =  this.requestBodyList;
            } else {
                data.requestParamVos[0]['body']['bodyParams'] =  this.requestBodyList2;
            }
        }

        if (this.requestHeaderList.length) {
            data.requestParamVos[0]['header'] =  this.requestHeaderList;
        }

        if (this.requestQueryList.length) {
            data.requestParamVos[0]['query'] =  this.requestQueryList;
        }

        data.responseParamVos = [{}];

        if (this.responseHeaderList.length) {
            data.responseParamVos[0]['headers'] = this.responseHeaderList;
        }

        if (this.responseSuccessList.length) {
            data.responseParamVos[0]['success'] =  this.responseSuccessList;
        }

        if (this.responseFailList.length) {
            data.responseParamVos[0]['fail'] =  this.responseFailList;
        }

        if (this.responseCodeList.length) {
            data.responseCodes = this.responseCodeList;
        }

        if (this.htmlResponseSuccess) {
            this.responseSucSample = this.elementResponseSuccess.nativeElement.innerText.replace(/\s+/gi, '');
        }

        if (this.htmlRequestBody && this.requestBodyType === 'json') {
            this.requestSample = this.elementRequestBody.nativeElement.innerText.replace(/\s+/gi, '');
        } else {
            this.requestSample = '';
        }

        if (this.htmlResponseFail) {
            this.responseFailSample = this.elementResponseFail.nativeElement.innerText.replace(/\s+/gi, '');
        }

        if (this.responseSucSample) {
            data.responseSucSample = this.responseSucSample;
        }

        if (this.responseFailSample) {
            data.responseFailSample = this.responseFailSample;
        }

        data.requestSample = this.requestSample;

        this.apiService.updateInterface(data).then((response: any) => {
            if (response.code === 200) {
                const obj = {
                    flag: 'see',
                    data: response.data
                };
                this.toSee.emit(obj);
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    /** ==========  校验   ==========*/
    // 域名校验
    domainChange(value: any) {
        if (value) {
            this.selectedDomainIdError = false;
            return false;
        } else {
            return true;
        }
    }

    // 递归校验参数
    recursionCheck(node: any, key: any, oldflag: any) {
        let flag = oldflag;
        const rex = /(^[a-zA-Z]{1})([a-zA-Z0-9\_\-\.]{0,126})?([a-zA-Z]{1})$/;
        const rex2 = /^[a-zA-Z]{1,128}$/;
        node.forEach((one: any) => {
            if (key === 'name') {
                if (!one.paramName) {
                    one['error'] = true;
                    flag = true;
                } else {
                    if (one.paramName.length > 1) {
                        if (!(rex.test(one.paramName))) {
                            one['error'] = true;
                            flag = true;
                        }
                    } else {
                        if (!(rex2.test(one.paramName))) {
                            one['error'] = true;
                            flag = true;
                        }
                    }
                }
            } else {
                if (one[key]) {
                    const str = one[key].replace(/(^\s*)|(\s*$)/g, '');
                    one[key] = str;
                    if (str.length > 256) {
                        one[key + 'Error'] = true;
                        flag = true;
                    }
                }
            }

            if (one.child) {
                this.recursionCheck(one.child, key, flag);
            }
        });
        return flag;
    }

    // 校验参数名称
    checkError(list: any, type: any, key: any) {
        let flag = false;
        switch (type) {
            case 'json':
                flag = this.recursionCheck(list, key, flag);
                break;
            default: break;
        }
        return flag;
    }

    // 校验必填参数
    checkRequired(list: any, text: any) {
        let flag = false;
        if (!list.length) {
            this.message.create('error', `${text}`);
            flag = true;
        }
        return flag;
    }
}

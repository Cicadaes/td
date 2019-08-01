import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CarouselAppAddDialogService } from './carousel-app-add-dialog.service';
import { ApplistService } from '../../../../@themes/transform-service';
import * as _ from 'lodash';

@Component({
    selector: 'carousel-app-add-dialog',
    templateUrl: 'carousel-app-add-dialog.component.html',
    styleUrls: ['carousel-app-add-dialog.component.css']
})
export class CarouselAppAddDialogComponent implements OnInit, OnDestroy {
    @Output() click = new EventEmitter();
    @Input() isShow = false;

    @Output() onSubmit = new EventEmitter<any>();
    @Input() queryParams: any;
    @Input() tenantId: any;

    @Input() dataCheckInfo: any;
    @Input() curAppId: any;
    @Input() addType: any;
    @Input() database: any;

    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;

    checkedAppList: any[] = [];
    isCollapse = true;
    curApp: any = {};
    resourceTreeData: any[] = [];
    isSetTreeDatas = true;
    queryAppIds: any[] = [];
    _appKeyWord = '';
    _needSelectCheckbox = true;
    isDataLoading = false;
    flag = true;
    errorFlag = false;

    checkedListCopy: any[];

    appShow = false;

    // 重写
    @Output() onClose = new EventEmitter<any>();  // 关闭弹窗的事件
    @Input() checkedList: any[]; // 已经选的app

    private appList: any = [];  /** 在此模块中获取applist，保持最新选中纪录 */

    ngOnInit() {
        if (this.tenantId) {
            this.queryTenantAppList();
        } else {
            this.queryAppList();
        }
    }

    ngOnDestroy() {
    }

    handleOk = (e: any) => {
        this.onSubmit.emit(this.getCheckData(this.appList));
        const data = this.getCheckData(this.appList);
        if (data && data.length) {
            this.onClose.emit();
        }
    }

    /**
     * 取消修改，关闭弹窗
     * @param  {Boolean} this.isVisible [description]
     * @return {[type]}                 [description]
     */
    private handleCancel = (e: any) => {
        this.onClose.emit();
    }


    constructor(private appListSer: ApplistService, private service: CarouselAppAddDialogService) {

    }

    toggleCollapse() {
        this.isCollapse = !this.isCollapse;
    }

    /**
     * 查询appList
     * @return {[type]} [description]
     */
    private queryTenantAppList() {
        this.isDataLoading = true;
        this.service.queryAppList({ tenantId: this.tenantId }).then((data: any) => {
            this.isDataLoading = false;
            const appData = data.list;
            if (this.addType === 'add') {
                this.appList = appData;
            } else {
                this.appList = _.cloneDeep(this.database);
            }
            this.showAppList();
            this.setCheckApplist();
            this.switchApp(this.appList.filter((item: any) => item.id === this.curAppId)[0]);   /** 初始化进入选中的app */
        }).catch((err: any) => {
            console.log(err);
        });
    }

    queryAppList() {
        this.isDataLoading = true;
        const param = this.queryParams || {};
        param.status = 1;
        this.service.queruAppAllList(param).then((response: any) => {
            this.isDataLoading = false;
            const appData = response.result;
            if (this.addType === 'add') {
                this.appList = appData;
            } else {
                this.appList = _.cloneDeep(this.database);
            }

            this.showAppList();  /** 设置Applist的show属性 */
            this.setCheckApplist();    /** 根据已有的设置配置获取到的数据 */
            this.switchApp(this.appList.filter((item: any) => item.id === this.curAppId)[0]);    /** 初始化进入选中的app */
        }).catch((err: any) => {
            console.log(err);
        });
    }

    dataContainsParam(data: any, id: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i] === id) {
                return true;
            }
        }
        return false;
    }



    getCheckedTreeByAppId() {
        let checkedTree: any[] = [];
        if (this.curApp && this.curApp.id && this.checkedListCopy && this.checkedListCopy.length > 0) {
            for (let i = 0; i < this.checkedListCopy.length; i++) {
                const app = this.checkedListCopy[i];
                if (app.id === this.curApp.id) {
                    checkedTree = app.tree;
                    break;
                }
            }
        }
        return checkedTree;
    }

    checkDataInCheckedTree(data: any, checkedTree: any[]): boolean {
        let isIn = false;
        if (data && checkedTree && checkedTree.length > 0) {
            for (let i = 0; i < checkedTree.length; i++) {
                if (data.id === checkedTree[i].id && checkedTree[i].checked) {
                    isIn = true;
                    break;
                }
            }
        }
        return isIn;
    }


    getChildrenTreeByParentId(data: any, checkedTree: any[]) {
        let tree: any[] = [];
        if (data && checkedTree && checkedTree.length > 0) {
            for (let i = 0; i < checkedTree.length; i++) {
                if (data.id === checkedTree[i].id && checkedTree[i].checked) {
                    tree = checkedTree[i].children;
                    break;
                }
            }
        }
        return tree;
    }

    checkTreeDatas(list: any[], checkedTree: any[]) {
        if (checkedTree && checkedTree.length > 0 && list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                const isIn = this.checkDataInCheckedTree(list[i], checkedTree);
                if (isIn) {
                    list[i].checked = true;
                    const tree = this.getChildrenTreeByParentId(list[i], checkedTree);
                    if (list[i].children && list[i].children.length > 0) {
                        this.checkTreeDatas(list[i].children, tree);
                    }
                }
            }
        }
    }



    // queryAppIds
    initCurApp() {
        if (this.appList && this.appList.length > 0) {
            this.appList[0].active = true;
            this.curApp = this.appList[0];
            this.queryResourceTreeDatasByApp();
        }
    }

    updateChildrenCheckbox(node: any) {
        if (!node) {
            return false;
        }
        if (node.checked) {
            if (node.children && node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
                    const item = node.children[i];
                    item.checked = true;
                    if (item.children && item.children.length > 0) {
                        this.updateChildrenCheckbox(item);
                    }
                }
            }
        } else {
            if (node.children && node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
                    const item = node.children[i];
                    item.checked = false;
                    if (item.children && item.children.length > 0) {
                        this.updateChildrenCheckbox(item);
                    }
                }
            }
        }
    }

    checkCurApp(value: any, app: any) {
        this.errorFlag = false;
        if (app && app.tree && app.tree.length > 0) {
            for (let i = 0; i < app.tree.length; i++) {
                app.tree[i].checked = value;
                this.updateChildrenCheckbox(app.tree[i]);
            }
        }
    }





    checkNeedChecked(list: any[]) {
        let checked = false;
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].checked) {
                    checked = true;
                    break;
                }
            }
        }
        return checked;
    }

    checkedCurApp(data: any) {
        if (data && this.appList && this.appList.length > 0) {
            for (let i = 0; i < this.appList.length; i++) {
                if (data.appId && data.appId === this.appList[i].id) {
                    this.appList[i].checked = this.checkNodeChecked(this.resourceTreeData);
                    break;
                }
            }
        }
    }

    getBackTreeDatas(data: any) {
        this.errorFlag = false;
        // this.checkedCurApp(data);
        this.checkedItemApp(data);
    }

    checkedItemApp(data: any) {
        let m = 0;
        for (let i = 0; i < this.resourceTreeData.length; i++) {
            if (this.resourceTreeData[i].checked) { m++; }  // 保存下一级中选中的个数
        }

        for (let j = 0; j < this.appList.length; j++) {
            if (data.appId && data.appId === this.appList[j].id) {
                this.appList[j].checked = (m > 0);
            }
        }
    }

    onSearchApp(value: string): void {
        this.showAppList();
        let type = true;
        let a = 0;
        if (value && this.appList && this.appList.length > 0) {
            for (let i = 0; i < this.appList.length; i++) {
                const name = this.appList[i].name;
                if (name && name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    this.appList[i].isShow = true;
                    a++;
                } else {
                    this.appList[i].isShow = false;
                    type = false;
                }
            }
        }

        if (value != '') {
            if (a > 0) {
                this.appShow = false;
            } else {
                this.appShow = true;
            }
        } else {
            this.appShow = false;
        }

        if (type) {
            this.flag = true;
        } else {
            this.flag = false;
        }

    }


    /**
     * 使功能列表可编辑
     * @param  {Array<any>} arr [description]
     * @return {[type]}         [description]
     */
    private editableAppFun(arr: Array<any>) {
        for (const item of arr) {
            item && (item.disabled = false);

            if (item.children && item.children.length) {
                this.editableAppFun(item.children);
            }
        }
    }

    /**
      * 是弹窗的check勾选项显示一致
      * @param  {Array<any>} arr [description]
      * @return {[type]}         [description]
      */
    private adaptCheck(arr: Array<any>, sarr: Array<any> = [], isclear: boolean = false) {
        isclear && (sarr = []);

        if (arr && arr.length) {
            if (sarr && sarr.length) {
                arr.forEach((item: any, index: number) => {
                    if (sarr && sarr[index]) {
                        if (item.id === sarr[index].id) {
                            Object.assign(item, {
                                checked: sarr[index].checked || false
                            });

                            if (item.children && item.children.length > 0) {
                                this.adaptCheck(item.children, sarr[index].children, isclear);
                            }
                        } else {
                            Object.assign(item, {
                                checked: false
                            });

                            if (item.children && item.children.length > 0) {
                                this.adaptCheck(item.children, sarr[index].children, isclear);
                            }
                        }


                    } else {
                        item.checked = false;
                        if (item.children && item.children.length > 0) {
                            this.adaptCheck(item.children);
                        }
                    }
                });
            } else {
                arr.forEach((item: any) => {
                    item.checked = false;
                    if (item.children && item.children.length > 0) {
                        this.adaptCheck(item.children, [], isclear);
                    }
                });
            }
        }
    }


    /**
     * 检查是否有选中
     * @return {[type]} [description]
     */
    private checkNodeChecked(data: any): any {
        if (this.resourceTreeData && this.resourceTreeData.length > 0) {
            for (const item of this.resourceTreeData) {
                if (item && item.checked) {
                    return true;
                } else if (item.children && item.children.length > 0) {
                    return this.checkNodeChecked(item);
                } else {
                    return false;
                }
            }
        }
    }


    /**
     * 同步更新tree
     * @return {[type]} [description]
     */
    private updateTree(id: any, tree: any) {
        if (this.checkedList && this.checkedList.length) {
            for (const item of this.checkedList) {
                if (item.id === id) {
                    item.tree = tree;
                }
            }
        }
    }

    /**
     * 根据ID获取当前App
     * @return {[type]} [description]
     */
    private getCurApp(arr: any, id: any) {
        if (arr && arr.length) {
            for (const item of arr) {
                if (item.id === id) {
                    return item;
                }
            }
        }
        return arr[0];
    }

    /**
     * 设置applist的show属性为true
     * @return {[type]} [description]
     */
    private showAppList() {
        if (this.appList && this.appList.length > 0) {
            for (let i = 0; i < this.appList.length; i++) {
                this.appList[i].isShow = true;
            }
        }
    }

    /**
     * 根据已有的app设置所有的app
     * @return {[type]} [description]
     */
    private setCheckApplist() {
        if (this.appList && this.appList.length && this.checkedList && this.checkedList.length) {
            this.appList.forEach((item: any) => {
                for (const sitem of this.checkedList) {
                    if (item.id === sitem.id) {
                        item.tree = JSON.parse(JSON.stringify(sitem.tree));
                        item.checked = true;
                        break;
                    }
                }
            });
        }
    }

    /**
     * 切换App
     * @param  {any}    app   [description]
     * @param  {Event}  event [description]
     * @return {[type]}       [description]
     */
    private switchApp(app: any, event: Event = null) {
        event && event.stopPropagation();
        this.flag = true;
        if (app && this.curApp && app.id === this.curApp.id) {
            return false;
        }
        this.resetCurApp(app);
    }

    /**
     * 设置当前APP
     * @param  {any}    app [description]
     * @return {[type]}     [description]
     */
    private resetCurApp(app: any) {
        if (!app) {
            app = this.appList[0];
        }
        if (this.appList && this.appList.length > 0) {
            for (let i = 0; i < this.appList.length; i++) {
                this.appList[i].active = false;
            }
        }
        app.active = true;
        this.curApp = app;
        this.queryResourceTreeDatasByApp();
    }


    /**
     * 根据app获取功能
     * @return {[type]} [description]
     */
    queryResourceTreeDatasByApp() {
        let url = '';
        if (this.tenantId) {
            url = window['appConfig']['apiCode'] + '/appController/queryTenantEachAppFuncEach';
        } else {
            url = window['appConfig']['apiCode'] + '/appController/queryFunctionListByApp';
        }
        const curCheckTree: any = this.getCurCheckTree();
        const param: any = {};
        param.tenantId = this.tenantId;
        param.id = this.curApp.id;
        if (this.queryParams) {
            param.value = this.queryParams.id;
        }

        this.service.queryAppFunList(param, url).then((response: any) => {
            this.queryAppIds.push(this.curApp.id);
            if (this.tenantId) {
                this.resourceTreeData = response.result.tree;
                // 使右侧功能选项可编辑
                this.editableAppFun(this.resourceTreeData);
            } else {
                this.resourceTreeData = response.result;
            }
            this.appListSer.setNoCheck(this.resourceTreeData);
            this.appListSer.syncAppCheck(curCheckTree, this.resourceTreeData);
            this.updateCurAppTree();  /** 更新applist */
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * 从Applist中获取当前treeData
     * @return {[type]} [description]
     */
    private getCurCheckTree() {
        let checkedTree: any = [];
        if (this.curApp && this.curApp.id && this.appList && this.appList.length) {
            for (const item of this.appList) {
                if (item.id === this.curApp.id) {
                    checkedTree = item.tree;
                    break;
                }
            }
        }
        return checkedTree;
    }

    /**
     * 更新applist
     * @return {[type]} [description]
     */
    private updateCurAppTree() {
        this.curApp.tree = this.resourceTreeData;
        if (this.appList && this.appList.length > 0) {
            for (let i = 0; i < this.appList.length; i++) {
                if (this.appList[i].id === this.curApp.id) {
                    this.appList[i].tree = this.resourceTreeData;
                    break;
                }
            }
        }
    }

    /**
     * 获取选中的数据
     * @return {[type]} [description]
     */
    private getCheckData(arr: any, attr: string = 'tree') {
        const newAppList: any = arr.filter((item: any) => {
            return item.checked;
        });
        return this.recursionCheck(newAppList);
    }

    /**
     * 循环获取checked的数据
     * @return {[type]} [description]
     */
    private recursionCheck(arr: any, attr: string = 'tree') {
        arr.forEach((item: any) => {
            if (item[attr] && item[attr].length) {
                if (item[attr] && item[attr].length && item[attr] instanceof Array) {
                    item[attr] = item[attr].filter((sitem: any) => sitem.checked);
                    item[attr].forEach((sitem: any) => {
                        if (sitem.children && sitem.children.length) {
                            this.recursionCheck(sitem.children, 'children');
                        }
                    });
                }
            }
        });
        return arr;
    }

}

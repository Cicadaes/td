import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ScrollToTopService } from '../../@themes/scroll-service';
import { NzModalService } from 'ng-cosmos-ui';
import { ApiService } from './api.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-api',
    templateUrl: './api.component.html',
    styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {
    versionOinterface: any = {
        flag: 'interface'
    };
    productList: any;
    nowData: any = {
        label: '',
        value: ''
    };

    addProductFlag = false;                  // 添加产品分类
    editProductFlag = false;                 // 编辑产品分类
    editProductData: any = {};               // 当前数据产品分类

    addInterfaceFlag = false;                // 添加接口
    editInterfaceFlag: any = 'add';          // 编辑接口
    editInterfaceData: any = {};             // 当前接口
    interfaceObj: any;                       // 版本与树之间的联动传值

    interfaceDetail: any;                    // 新建、编辑、查看、相关数据传值
    interfaceDetailFlag = false;             // 是否展示详情组件
    catalogId: any;
    tabs: any = [
        { name: '接口管理', id: 1 , show: true},
        { name: '版本管理', id: 2 , show: false},
    ];
    index: any = 1;

    moduleFlag = 'a';

    constructor(
        private service: ApiService,
        private scrollSer: ScrollToTopService,
        private confirmServ: NzModalService
        ) {
    }

    ngOnInit() {
        this.getProductList();
    }


    getProductList() {
        this.service.getProductList().then((data: any) => {
            if (data.code === 200) {
                this.productList = [];
                this.productList = data.data;
            }
        }).catch((err: any) => {
        });
    }

    pushCataloagId(value: any) {
        if (value !== this.catalogId) {
            this.catalogId = value;
        }
    }

    changeIndex(one: any) {
        this.index = one.id;
    }

    // 当api树切换（选中）节点时
    /**
     * @param name  节点名称
     * @param id    节点id
     * @param flag  区分是版本还是接口
    */
    checkOne(obj: any) {
        this.versionOinterface = obj;
        this.index = 1;
        if (obj.obj && obj.obj.level === 0) {
            this.tabs[1].show = true;
        } else {
            this.tabs[1].show = false;
        }
        this.nowData = {};
        this.nowData['label'] = obj.name;
        this.nowData['value'] = obj.id;
        this.nowData['obj'] = obj.obj;
        this.interfaceDetailFlag = false;
    }

    // 树相关操作
    operation(obj: any) {
        const that = this;
        if (obj.add === 'add') {
            this.addProductFlag = true;
            this.editProductFlag = false;
        } else if (obj.add === 'edit') {
            this.addProductFlag = true;
            this.editProductFlag = true;
        } else if (obj.add === 'addInterface') {
            this.addInterfaceFlag = true;
            this.editInterfaceFlag = 'add';
        }  else if (obj.add === 'editInterface') {
            this.addInterfaceFlag = true;
            this.editInterfaceFlag = 'edit';
            this.editInterfaceData = obj;
        } else if (obj.add === 'delete') {
            let title, content;
            this.service.checkDeleteProduct(obj.obj.key).then((one: any) => {
                if (one.code === 200) {
                    if (one.data) {
                        this.confirmServ.warning({
                            nzTitle: `产品分类“${obj.obj.title}”中存在已发布的接口，请先下线这些接口再删除分类。`,
                            nzOnCancel: () => {
                            }
                        });
                    } else {
                        if (obj.level) { // 子集要删除api
                            title = `你确定要删除“${obj.obj.title}”及下属的所有接口吗？`;
                            content = `删除后无法恢复，你还要继续吗？`;
                        } else {
                            title = `你确定要删除“${obj.obj.title}”及下属的所有子分类、接口吗？`;
                            content = `删除后无法恢复，你还要继续吗？`;
                        }
                        this.confirmServ.confirm({
                            nzTitle: title,
                            nzContent: content,
                            nzOnOk: () => {
                                that.service.deleteProduct(obj.obj.key).then((data: any) => {
                                    if (data.code === 200) {
                                        that.tabs[1].show = false;
                                        that.index = 1;
                                        that.nowData = {};
                                        that.nowData['label'] = '';
                                        that.nowData['value'] = '';
                                        that.getProductList();
                                    }
                                }).catch((err: any) => {
                                });
                            },
                            nzOnCancel: () => {}
                        });
                    }
                }
            });
        }
        this.editProductData = obj;
        this.interfaceObj = obj;
    }


    hideProductDialog($event: any) {
        this.addProductFlag = false;
        this.editProductFlag = false;
    }
    // 保存新建、编辑分类弹框
    saveProductDate() {
        this.addProductFlag = false;
        this.editProductFlag = false;
        this.nowData = {};
        this.nowData['label'] = '';
        this.nowData['value'] = '';
        this.tabs[1].show = false;
        this.getProductList();
    }

    hideInterfaceDialog($event: any) {
        this.addInterfaceFlag = false;
        this.editInterfaceFlag = 'add';
    }

    // 保存新建、编辑接口弹框
    saveInterfaceDate(data: any) {
        this.addInterfaceFlag = false;
        this.editInterfaceFlag = 'add';

        if (data && data.flag && data.flag === 'edit') {
            const obj = {};
            _.assign(obj, this.nowData);
            this.nowData = obj;
            this.interfaceDetailFlag = false;
        } else {
            this.interfaceDetailFlag = true;
            this.interfaceDetail = _.assign({}, data);
            this.moduleFlag = this.interfaceDetail.flag;
        }
    }


    // 版本的相关操作
    operationInterface(obj: any) {
        if (obj.add === 'add') {
            this.addInterfaceFlag = true;
            this.editInterfaceFlag = 'add';
        } else if (obj.add === 'edit') {
            this.addInterfaceFlag = true;
            this.editInterfaceFlag = 'edit';
            this.editInterfaceData = obj.obj;
        } else if (obj.add === 'see') {
            this.editInterfaceFlag = 'see';
            this.addInterfaceFlag = false;
            this.interfaceDetailFlag = true;
            const json = {};
            json['flag'] = obj.add;
            json['obj'] = _.assign({}, obj.obj);
            this.interfaceDetail = _.assign({}, json);
            this.moduleFlag = this.interfaceDetail.flag;
        } else if (obj.add === 'copy') {
            this.addInterfaceFlag = true;
            this.editInterfaceFlag = 'copy';
            this.editInterfaceData = obj.obj;
        }
        obj.add !== 'edit' ?  this.interfaceObj = obj :  this.interfaceObj = {} ;
    }

    // 判断
    infoFlag(falg: any) {
        this.moduleFlag = falg;
    }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiTreeService } from './api-tree.service';
import { NzTreeNode, NzFormatEmitEvent } from 'ng-cosmos-ui';


@Component({
    selector: 'app-api-tree',
    templateUrl: './api-tree.component.html',
    styleUrls: ['./api-tree.component.css'],
    providers: [ApiTreeService]
})

export class ApiTreeComponent implements OnInit {
    @Output() checkOne = new EventEmitter<any>();
    @Output() operation = new EventEmitter<any>();
    @Input() set productList(value: any) {
        this.nodes = [];
        this._productList = value;
        if ((typeof value) !== 'undefined') {
            this.loadingFlag = false;
            value.forEach((item: any, index: any) => {
                this.setTreeData(item);
                this.nodes.push(new NzTreeNode(item));
            });
            this.setTree(this.nodes);
        }
    }
    _catalogId: any;
    @Input() set catalogId(value: any) {
        if (value !== this._catalogId) {
            this._catalogId = value;
            this.setTree(this.nodes);
        }
    }
    checkOneObj: any;                 // 回传给父节点的当先选中节点
    treeData: any = [];               // 接口返回treeData
    nodes: any = [];                  // 组装后的treeData
    nowNode: any;                     // tree当前选中节点
    selectAllFlag = true;             // 是都选中全部接口
    operationData: any;
    loadingFlag = true;
    _productList: any = [];
    constructor() { }

    ngOnInit() {
    }

    // 重置当前树的选中状态
    setTree(list: any) {
        let flag = true;
        list.forEach((item: any, index: any) => {
            item.isSelected = false;
            if (this._catalogId && this._catalogId === item.key) {
                item.isSelected = true;
                flag = false;
            }
            if (item.children) {
                for (let i = 0; i < item.children.length; i++) {
                    item.children[i].isSelected = false;
                    if (this._catalogId && this._catalogId === item.children[i].key) {
                        item.children[i].isSelected = true;
                        item.isExpanded = true;
                        flag = false;
                    }
                }
            }
        });
        this.selectAllFlag = flag;
    }

    // 设置处理tree的节点数据
    setTreeData(node: any) {
        node.title = node.name;
        node.key = node.id;
        if (!node.children || (node.children && node.children.length < 1)) {
            node.isLeaf = true;
            return;
        } else {
            for (let i = 0; i < node.children.length; i++) {
                this.setTreeData(node.children[i]);
            }
        }
    }

    // 展开节点
    toggleNode(e: any): void {
        this.selectAllFlag = false;
        this.nowNode = e.node;
        e.node.isSelected = true;
        if (e.node.level) {
            return;
        }
        e.node.isExpanded = !e.node.isExpanded;
    }

    // 点击树节点,显示详情
    showDetail(e: NzFormatEmitEvent): void {
        this.checkOneObj = {
            name: e.node.title,
            id: e.node.key,
            flag: 'interface',
            obj : e.node
        };
        this.checkOne.emit(this.checkOneObj);
    }

    // 选择全部接口
    selectAll() {
        this.selectAllFlag = true;
        if (this.nowNode && this.nowNode['isSelected']) {
            this.nowNode.isSelected = false;

        }
        this.checkOneObj = {
            flag: 'interface'
        };
        this.checkOne.emit(this.checkOneObj);
    }

    // 添加产品分类
    addProduct() {
       this.operationData = {};
       this.operationData['add'] = 'add';
       this.operationData['level'] = 0;
       this.operationData['obj'] = {};
       this.operation.emit(this.operationData);
    }

    // 在产品下新建子分类 || 在子分类下新建接口
    add(id: any, node: any) {
        this.operationData = {};
        this.operationData['level'] = 1;
        this.operationData['obj'] = node;
        this.operationData['add'] = 'add';
        this.operation.emit(this.operationData);
    }

    // 在子分类下新建接口
    addInterface(id: any, node: any) {
        this.operationData = {};
        this.operationData['add'] = 'addInterface';
        this.operationData['level'] = 2;
        this.operationData['obj'] = node;
        this.operation.emit(this.operationData);
    }

    // 编辑
    edit(id: any, node: any) {
       this.operationData = {};
       this.operationData['add'] = 'edit';
       this.operationData['level'] = node.level;
       this.operationData['obj'] = node;
       this.operation.emit(this.operationData);
    }

    // 点击删除
    delete(id: any, node: any) {
        this.operationData = {};
        this.operationData['add'] = 'delete';
        this.operationData['level'] = node.level;
        this.operationData['obj'] = node;
        this.operation.emit(this.operationData);
    }
}

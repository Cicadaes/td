import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { ComMenuTreeService } from './cmMenuTree.service';
import { Subscription } from 'rxjs/Subscription';
import { RadioValue } from './menuView/radio';
import { Subject } from 'rxjs/Subject';
import { OrgMenuTreeService } from './MenuTree.service';

@Component({
    selector: 'app-menu-tree',
    templateUrl: './cmMenuTree.component.html',
    styleUrls: ['./cmMenuTree.component.css'],
    providers: [ComMenuTreeService, OrgMenuTreeService],
})

export class ComMenuTreeComponent implements OnInit {
    _cmHasChecked = true;  //  是否有多选框
    _cmHasShow = true;  //  是否有下拉菜单
    noData = false;  //  数据是否为空
    isVisible = false;  //  控制modal显示隐藏
    subscription: Subscription;  //  监听事件
    _cmHasRadio = false;  //  是否是单选框
    _cmHasEllips = true;  //  是否有省略号
    _cmHasMenu = true;  //  是否菜单项
    moveThisFile: any;  //  要移动的文件
    radioThisFile: any;  //  单选选中的文件
    fatherFile: any;   //  移动文件的父级容器
    radioFather: any;  //  选中单选框的父级容器
    ismine = true;
    _cmHasSearch = true;  //  是否有搜索
    private treeData: any[] = null;  //  存放菜单数据
    private treeMenu: any[] = null;  //  存放菜单项数据
    private modalData: any[] = null;  //  存放菜单数据
    check = true;
    _hasSelect = true;
    _cmcheckFathser = false;
    inputValue: string;
    _cmPlaceHolder = '请输入文件名称';
    title: any;
    deepData: any;
    deepMenu: any;
    //   树状菜单数据
    _cmData: any =
        [
            {
                'id': '1',
                'content': '总目录',
                'show': true,  //  默认展开
                'ellipsisShow': false,
                'menuShow': false,
                'checked': false,
                'radio': false,
                'readonly': true,
                'select': true,
                'children': [
                    {
                        'id': '2',
                        'content': '文件夹1',
                        'show': true,
                        'ellipsisShow': false,
                        'menuShow': false,
                        'checked': false,
                        'radio': false,
                        'readonly': true,
                        'select': false,
                        'children': [
                            {
                                'id': '4',
                                'content': '文件1',
                                'show': true,
                                'ellipsisShow': false,
                                'menuShow': false,
                                'checked': false,
                                'radio': false,
                                'readonly': true,
                                'select': false,
                                'children': [],
                            },
                            {
                                'id': '5',
                                'content': '文件2',
                                'show': true,
                                'ellipsisShow': false,
                                'menuShow': false,
                                'checked': false,
                                'radio': false,
                                'readonly': true,
                                'select': false,
                                'children': [],
                            }
                        ]
                    },
                    {
                        'id': '3',
                        'content': '文件夹2',
                        'show': true,
                        'ellipsisShow': false,
                        'checked': false,
                        'radio': false,
                        'readonly': true,
                        'select': false,
                        'children': [
                            {
                                'id': '6',
                                'content': '文件1',
                                'show': true,
                                'ellipsisShow': false,
                                'menuShow': false,
                                'checked': false,
                                'radio': false,
                                'readonly': true,
                                'select': false,
                                'children': [],
                            },
                            {
                                'id': '7',
                                'content': '文件2',
                                'show': true,
                                'ellipsisShow': false,
                                'menuShow': false,
                                'checked': false,
                                'radio': false,
                                'readonly': true,
                                'select': false,
                                'children': [],
                            }
                        ]
                    }
                ]
            }
        ];
    //   右键菜单项数据
    _cmMenu: any = [
        {
            value: '新增文件',
            label: 'create',
            disabled: false
        },
        {
            value: '删除文件',
            label: 'delete',
            disabled: false
        },
        {
            value: '编辑文件',
            label: 'update',
            disabled: false

        },
        {
            value: '移动文件',
            label: 'move',
            disabled: false

        }
    ];

    @Input()
    set cmPlaceHolder(cmPlaceHolder: any) {
        this._cmPlaceHolder = cmPlaceHolder;
    }

    @Input()
    set cmHasRadio(cmHasRadio: any) {
        this._cmHasRadio = cmHasRadio;
    }

    @Input()
    set cmHasSearch(cmHasSearch: any) {
        this._cmHasSearch = cmHasSearch;
    }

    @Input()
    set cmcheckFathser(cmcheckFathser: any) {
        this._cmcheckFathser = cmcheckFathser;
    }

    @Input()
    set hasSelect(hasSelect: any) {
        this._hasSelect = hasSelect;
    }

    @Input()
    set cmHasChecked(cmHasChecked: any) {
        this._cmHasChecked = cmHasChecked;
    }

    @Input()
    set cmHasEllips(cmHasEllips: any) {
        this._cmHasEllips = cmHasEllips;
    }

    @Input()
    set cmHasMenu(cmHasMenu: any) {
        this._cmHasMenu = cmHasMenu;
    }

    @Input()
    set cmHasShow(cmHasShow: any) {
        this._cmHasShow = cmHasShow;
    }

    @Input()
    set cmData(cmData: any) {
        this._cmData = cmData;
    }

    @Input()
    set cmMenu(cmMenu: any) {
        this._cmMenu = cmMenu;
    }

    @Output() ondataChange = new EventEmitter<any>();
    @Output() createMenu = new EventEmitter<any>();
    @Output() clickItems = new EventEmitter<any>();
    @Output() selectRadio = new EventEmitter<any>();

    //   改变数据
    vote(data: any) {
        this.ondataChange.emit(data);
    }

    //   增加菜单项
    vote1(obj: any) {
        this.createMenu.emit(obj);
    }

    //   点击树状
    vote2(select: any) {
        this.clickItems.emit(select);
    }

    //   单选框回调
    vote4(select: any) {
        this.selectRadio.emit(select);
    }

    constructor(
        private comMenuTreeService: ComMenuTreeService,
        private orgMenuTreeService: OrgMenuTreeService
    ) {
        this.treeData = this.deepCopy(this._cmData);
        this.modalData = this.deepCopy(this._cmData);
        //   移动回调
        this.subscription = this.comMenuTreeService.missionGrabble$.subscribe((obj: any) => {
            this.comMenuTreeService.dataChange('move', obj.select);
        });
        //   单选框回调
        this.subscription = this.comMenuTreeService.missiongetRadio$.subscribe((radio: any) => {
            this.getRadio(this._cmData);
            this.vote4(radio);
        });
        //   改变数据回调
        this.subscription = this.comMenuTreeService.missiondataChange$.subscribe((obj: any) => {
            obj['data'] = this._cmData;
            this.treeData = this.deepCopy(this._cmData);
            this.modalData = this.deepCopy(this._cmData);
            this.vote(obj);
        });
        //   移动回调
        this.subscription = this.orgMenuTreeService.missionmoveChangeData$.subscribe((data: any) => {
            this._cmData = data;
            this.treeData = this.deepCopy(this._cmData);
            this.modalData = this.deepCopy(this._cmData);
        });
        //   点击回调
        this.subscription = this.comMenuTreeService.missionclickItems$.subscribe((select: any) => {
            const obj = {};
            obj['type'] = 'click';
            obj['select'] = select;
            obj['data'] = this._cmData;
            this.clickItem(select, this._cmData);
            this.vote2(obj);
        });
        //   新增菜单回调
        this.subscription = this.comMenuTreeService.missioncreateMenu$.subscribe((obj: any) => {
            obj['data'] = this._cmData;
            this.vote1(obj);
        });
    }

    //   点击树状
    clickItem(select: any, data: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == select.id) {
                data[i].select = true;
            } else {
                data[i].select = false;
            }
            if (data[i].children.length > 0) {
                this.clickItem(select, data[i].children)
            }
        }
    }

    ngOnInit() {
        //   this.initSelect(this._cmData)
        //   过滤菜单项
        const arr = [];
        for (let i = 0, len = this._cmMenu.length; i < len; i++) {
            if (this._cmMenu[i].disabled == true) {
                arr.push(i);
            }
        }
        for (let j = 0; j < arr.length; j++) {
            this._cmMenu.splice(j, 1);
        }

        //   空数据处理
        if (this._cmData.length < 1) {
            //   this.noData = true;
        }
        this.deepData = this.deepCopy(this._cmData);
        this.deepMenu = this.deepCopy(this._cmMenu);
        this.customMenu(this.deepData);
        this.treeData = this.deepCopy(this._cmData);
        this.modalData = this.deepCopy(this._cmData);
    }


    //  自定义菜单
    customMenu(data: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].customMenu && data[i].customMenu.length > 0) {
                //   console.log(data[i].customMenu);
            } else {
                data[i]['customMenu'] = this.deepMenu;
                this._cmData = this.deepData;
            }
            if (data[i].children.length > 0) {
                this.customMenu(data[i].children);
            }
        }
    }

    //   查询
    public search(value: string) {
        const searchText: string = value;
        this._cmData = this.deepCopy(this.treeData);
        if (this._cmData && this._cmData.length > 0) {
            this._cmData.forEach((n: any, i: any, a: any) => {
                this.searchEach(n, searchText);
            });
            //   没有叶子节点的根节点也要清理掉
            const length = this._cmData.length;
            for (let i = length - 1; i >= 0; i--) {
                const e2 = this._cmData[i];
                if (!this.isHaschildren(e2) && e2.content.indexOf(searchText) <= -1) {
                    this._cmData.splice(i, 1);
                }
            }
        }
    }


    //   对子节点进行搜索。
    private searchEach(node: any, value: string) {
        const depth = this.getTreeDepth(node);
        for (let i = 0; i < depth - 1; i++) {
            //   记录【删除不匹配搜索内容的叶子节点】操作的次数。
            //   如果这个变量记录的操作次数为0，表示树形结构中，所有的
            //   叶子节点(不包含只有根节点的情况)都匹配搜索内容。那么就没有必要再
            //   在循环体里面遍历树了.
            let spliceCounter = 0;

            //   遍历树形结构
            this.traverseTree(node, (n: any) => {
                if (this.isHaschildren(n)) {
                    const children = n.children;
                    const length = children.length;

                    //   找到不匹配搜索内容的叶子节点并删除。为了避免要删除的元素在数组中的索引改变，从后向前循环,
                    //   找到匹配的元素就删除。
                    for (let j = length - 1; j >= 0; j--) {
                        const e3 = children[j];
                        if (!this.isHaschildren(e3) && e3.content.indexOf(value) <= -1) {
                            children.splice(j, 1);
                            spliceCounter++;
                        }
                    }   //   end for (let j = length - 1; j >= 0; j--)
                }
            });   //   end this.traverseTree(node, n=>{

            //   所有的叶子节点都匹配搜索内容，没必要再执行循环体了。
            if (spliceCounter === 0) {
                break;
            }
        }
    }

    //   判断树形结构中的一个节点是否具有孩子节点
    private isHaschildren(node: any) {
        let flag = false;
        if (node.children.length > 0) {
            flag = true;
        }
        return flag;
    }

    //   通过传入根节点获得树的深度，是 calDepth 的调用者。
    private getTreeDepth(node: any) {
        if (undefined == node || null == node) {
            return 0;
        }
        //   返回结果
        let r = 0;
        //   树中当前层节点的集合。
        let currentLevelNodes = [node];
        //   判断当前层是否有节点
        while (currentLevelNodes.length > 0) {
            //   当前层有节点，深度可以加一。
            r++;
            //   下一层节点的集合。
            let nextLevelNodes = new Array();
            //   找到树中所有的下一层节点，并把这些节点放到 nextLevelNodes 中。
            for (let i = 0; i < currentLevelNodes.length; i++) {
                const e = currentLevelNodes[i];
                if (this.isHaschildren(e)) {
                    nextLevelNodes = nextLevelNodes.concat(e.children);
                }
            }
            //   令当前层节点集合的引用指向下一层节点的集合。
            currentLevelNodes = nextLevelNodes;
        }
        return r;
    }

    private traverseTree(node: any, callback: Function) {
        if (!node) {
            return;
        }
        const stack = [];
        stack.push(node);
        let tmpNode;
        while (stack.length > 0) {
            tmpNode = stack.pop();
            callback(tmpNode);
            if (tmpNode.children.length > 0) {
                for (let i: number = tmpNode.children.length - 1; i >= 0; i--) {
                    stack.push(tmpNode.children[i]);
                }
            }
        }
    }

    //  深拷贝
    private deepCopy(data: any): any {
        const json = JSON.stringify(data);
        return JSON.parse(json);
    }

    //   选中单选框
    getRadio(data: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == this.comMenuTreeService.selectRadio) {
                data[i].radio = true;
                this.radioThisFile = data[i];
                this.radioFather = data;
            } else {
                data[i].radio = false;
            }
            if (data[i].children.length > 0) {
                this.getRadio(data[i].children);
            }
        }
    }

}


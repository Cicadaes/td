import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { OrganizationTreeService } from './organization-tree.service';

@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html',
    styleUrls: ['./organization-tree.component.css'],
    // providers: [MenuTreeService]
})


export class OrganizationTreeComponent implements OnInit , OnChanges {
    @Input() treeData: any;
    @Output() onChange = new EventEmitter<any>();

    _treeData: any;
    _cmHasChecked = false; // 是否有多选框
    _cmHasShow = true; // 是否有下拉展开
    _cmHasMenu = false; // 是否需要菜单
    _cmData: any[] = [];
    // 菜单项数据
    _cmMenu: any[] = [];
    _cmcheckFathser = false;


    modalData: any;
    moveThisFile: any; // 要移动的文件
    radioThisFile: any; // 单选选中的文件
    check = true;
    isVisible = false;
    title = '';
    _cmPlaceHolder = '请输入名称';
    private deepData: any;
    private deepMenu: any;
    moveData: any; // 深拷贝选中文件的父级容器

    // , private menuTreeService: MenuTreeService

    constructor(private service: OrganizationTreeService
    ) {

    }

    // 数据改变
    // ondataChange(cmdata: any) {
    //     this.onChange.emit(cmdata);
    // }

    createMenu(cmdata: any) {
        this.onChange.emit(cmdata);
    }

    clickItems(cmdata: any) {
        this.onChange.emit(cmdata);
    }

    initTreeData(changes: any) {
        if (changes && changes.treeData) {
            this._treeData = changes.treeData.currentValue || {};
            this._cmData = this._treeData.data || this._cmData;
            this._cmMenu = this._treeData.menu || this._cmMenu;
            this._cmHasChecked = this._treeData.hasChecked || this._cmHasChecked;
            this._cmHasShow = this._treeData.hasShow || this._cmHasShow;
            this._cmHasMenu = this._treeData.needMenu || this._cmHasMenu;
            this._cmcheckFathser = this._treeData.checkFathser || this._cmcheckFathser;

            this.modalData = this.deepCopy(this._cmData);
            this.deepData = this.deepCopy(this._cmData);
            this.deepMenu = this.deepCopy(this._cmMenu);
            this.customMenu(this.deepData);
            this.modalData = this.deepCopy(this._cmData);

        }
    }

    // 自定义菜单
    customMenu(data: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].customMenu && data[i].customMenu.length > 0) {
                // console.log(data[i].customMenu);
            } else {
                data[i]['customMenu'] = this.deepMenu;
                this._cmData = this.deepData;
            }
            if (data[i].children.length > 0) {
                this.customMenu(data[i].children);
            }
        }
    }

    // 数据改变
    ondataChange(cmdata: any) {
        this.modalData = this.deepCopy(cmdata.data);
        if (cmdata.type === 'create') {
            // console.log('create')
        } else if (cmdata.type === 'delete') {
            // console.log('delete')
        } else if (cmdata.type === 'update') {
            // console.log('update')
        } else if (cmdata.type === 'move') {
            this.moveFile(cmdata.select);
        } else if (cmdata.type === 'checked') {
            // console.log('checked')
        } else {
            // console.log('nocheck')
        }

        this.onChange.emit(cmdata);
    }


    // 移动文件
    moveFile(select: any) {
        this.moveThisFile = select;
        this.isVisible = true;
        this.title = `请选择把"${select.content}"移动到位置下`;
        this.moveData = this.deepCopy(this.modalData);
        this.fiflterData(this.modalData);
    }

    // 弹出框过滤选中
    fiflterData(data: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === this.moveThisFile.id) {
                data.splice(i, 1);
            } else {
                if (data[i].children.length > 0) {
                    this.fiflterData(data[i].children);
                }
            }
        }
    }

    // 弹出框回复
    pushData(select: any, data: any) {
        this.modalData = this.moveData;
    }

    // 更新树数据
    updateData(data: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === this.radioThisFile.id) {
                data[i].children.push(this.moveThisFile);
            } else {
                if (data[i].children.length > 0) {
                    this.updateData(data[i].children);
                }
            }
        }
    }

    // 确认移动
    handleOk() {
        this.check = true;
        this.isVisible = false;
        this.pushData(this.moveThisFile, this.modalData);
        this.fiflterData(this._cmData);
        if (this.radioThisFile.children.length > 0) {
            this.updateData(this._cmData);
        } else {
            this.createData(this._cmData);
        }
    }

    // 更新树数据
    createData(data: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === this.radioThisFile.id) {
                data.splice(i + 1, 0, this.moveThisFile);
            } else {
                if (data[i].children.length > 0) {
                    this.createData(data[i].children);
                }
            }
        }
    }

    // 取消移动
    handleCancel() {
        this.check = true;
        this.updateData(this.moveThisFile);
        this.isVisible = false;
    }


    // 选中单选框
    selectRadio(value: any) {
        this.check = false;
        this.radioThisFile = value;
    }

    // 深拷贝
    private deepCopy(data: any): any {
        const json = JSON.stringify(data);
        return JSON.parse(json);
    }


    ngOnChanges(changes: SimpleChanges) {
        this.initTreeData(changes);
    }

    ngOnInit(): void {

    }
}

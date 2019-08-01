import { Component, OnInit, Input, ElementRef, EventEmitter, Output, ViewChild, ContentChild, Renderer2 } from '@angular/core';
import { ComMenuTreeService } from '../cmMenuTree.service';
import { Scope } from './createId';
import { RadioValue } from './radio';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-menu-view',
    templateUrl: './menuView.component.html',
    styleUrls: ['./menuView.component.css']
})
export class MenuViewComponent implements OnInit {
    _cmData: any;
    _cmMenu: any;
    _cmHasChecked: boolean;
    _cmHasShow: boolean;
    _cmHasRadio: boolean;
    _cmHasEllips: boolean;
    _cmHasMenu: boolean;
    radioValue: string;
    data: any;
    click = false;
    _hasSelect = true;
    _cmcheckFathser: boolean;

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
    set cmHasShow(cmHasShow: any) {
        this._cmHasShow = cmHasShow;
    }

    @Input()
    set cmHasRadio(cmHasRadio: any) {
        this._cmHasRadio = cmHasRadio;
    }

    @Input()
    set cmData(cmData: any) {
        this._cmData = cmData;
    }

    @Input()
    set cmHasMenu(cmHasMenu: any) {
        this._cmHasMenu = cmHasMenu;
    }


    @Input()
    set cmMenu(cmMenu: any) {
        this._cmMenu = cmMenu;
    }

    @Output() onVoted = new EventEmitter<boolean>();

    constructor(
        private confirmServ: NzModalService,
        private comMenuTreeService: ComMenuTreeService
    ) {

    }

    ngOnInit() {
    }

    @ViewChild('root') element: ElementRef;


    // 移入变色
    enterItems(select: any) {
        select.ellipsisShow = true;
    }

    // 移出变色
    leavesItems(select: any) {
        select.ellipsisShow = false;
    }


    // 点击树状
    clickItems(select: any, data: any) {
        this.comMenuTreeService.clickItems(select);
    }

    // 点击菜单项
    select(type: string, data: any, select: any) {
        select.menuShow = false;
        select.ellipsisShow = false;
        if (type == 'delete') {
            this.removeFile(data, select);
        } else if (type == 'update') {
            select.readonly = false;
            this.data = data;
            this.element.nativeElement.querySelector(`#input-${select.id}`).focus();
        } else if (type == 'create') {
            this.addFile(select)
        } else if (type == 'move') {
            this.comMenuTreeService.moveFile(select, data);
        } else {
            this.comMenuTreeService.createMenu(type, select);
        }
    }

    // 输入框失焦
    inputBlur(comment: any) {
        comment.readonly = true;
        this.element.nativeElement.querySelector(`#input-${comment.id}`).blur();;
    }



    // 编辑确认
    updateOK(comment: any) {
        comment.readonly = true;
        this.comMenuTreeService.dataChange('update', comment);
    }

    // 删除文件
    removeFile(data: any, select: any) {
        let title = '';
        const that = this;
        if (select.children == [] || select.children.length == 0) {
            title = `您是否确认要删除${select.content}`;
        } else {
            title = `${select.content}包含多个文件，是否确认删除`;
        }
        this.confirmServ.confirm({
            nzTitle: title,
            nzOnOk() {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id == select.id) {
                        data.splice(i, 1);
                        that.comMenuTreeService.dataChange('delete', select);
                    }
                }
            }
        });
    }

    // 新增文件
    addFile(select: any) {
        let scopeId = Scope.getInstance().getscope();
        let obj = {
            'id': scopeId,
            'content': '',
            'show': true,
            'ellipsisShow': false,
            'menuShow': false,
            'checked': false,
            'readonly': true,
            'select':false,
        };
        obj['children'] = [];
        obj['customMenu'] = this._cmMenu;
        if (select.checked == true) {
            obj['checked'] = true;
        }
        if (select.children != []) {
            obj.content = '新增文件';
        } else {
            obj.content = '新增文件';
            select['children'] = [];
        }
        select['children'].push(obj)
        this.comMenuTreeService.dataChange('create', select);
    }

    // 复选框操作
    checkChange(value: any, select: any) {
        if (value == true) {
            select.checked = true;
            this.comMenuTreeService.dataChange('checked', select);
            // this.vote(true);
            if (this._cmcheckFathser == true) {
                this.vote(true);
            }
            if (select.children != []) {
                const arr = select.children;
                for (let i = 0; i < arr.length; i++) {
                    arr[i].checked = true;
                    if (arr[i].children != []) {
                        const arr1 = arr[i].children;
                        this.loop(true, arr1);
                    }
                }
            }
        } else {
            select.checked = false;
            // this.vote(false);
            if (this._cmcheckFathser == true) {
                this.vote(false);
            }
            this.comMenuTreeService.dataChange('nocheck', select);
            if (select.children != []) {
                const arr = select.children;
                for (var i = 0; i < arr.length; i++) {
                    arr[i].checked = false;
                    if (arr[i].children != false) {
                        const arr1 = arr[i].children;
                        this.loop(false, arr1);
                    }
                }
            }

        }
    }

    // 循环调用
    loop(type: boolean, arr1: any) {
        for (let i = 0; i < arr1.length; i++) {
            this.checkChange(type, arr1[i]);
        }
    }

    // 复选框
    vote(type: boolean) {
        this.onVoted.emit(type);
    }
    // 循环调用复选框
    onVoteds(agreed: boolean, data: any) {
        if (agreed == true) {
            data.checked = true;
            this.vote(true);
        } else {
            const arr = data.children;
            const arr1 = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].checked == false) {
                    arr1.push(arr[i].checked);
                }
                if (arr1[len - 1] == false) {
                    data.checked = false;
                    this.vote(false);
                }
            }
        }
    }


    // 选中单选框
    radioThis(select: any) {
        this.comMenuTreeService.selectRadio = select.id;
        this.comMenuTreeService.getRadio(select);

    }


}



import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {SelectCustomService} from './select-custom.service';

@Component({
    selector: 'app-select-custom',
    templateUrl: './select-custom.component.html',
    styleUrls: ['./select-custom.component.less'],
    providers: [SelectCustomService],
})
export class SelectCustomComponent implements OnInit, OnChanges {
    @Input() select: any;
    @Output() onSelect = new EventEmitter<any>();
    _select: any;
    selectObject: any = {
        label: '请选择',
        value: ''
    };
    _searchKeyword: string;
    _options: any[] = [];
    _isShowOptions: boolean;
    _isSolid: boolean;
    _selectStyle: any = {
        width: '200px'
    };
    _opacity: boolean;
    onChange(value: any) {
        this._searchKeyword = value;
        this.queryData(false);
    }

    constructor(private service: SelectCustomService) {
    }

    trim(str: string) {
        if (str) {
            return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        } else {
            return '';
        }
    }

    changeInputValue(obj: any) {
        const value = obj.target.value;
        this._searchKeyword = this.trim(value);
    }

    queryData(init: boolean) {
        if (this._select && this._select.apiUrl && this._select.apiParam) {
            const param = this._select.apiParam || {};
            if (this._select.keywordFiled) {
                param[this._select.keywordFiled] = this.trim(this._searchKeyword);
            } else {
                param.keyword = this.trim(this._searchKeyword);
            }
            let apiUrl = this._select.apiUrl;
            if (!init && this._select.apiUrl2) {
                apiUrl = this._select.apiUrl2;
            }
            if (this._select.apiType === 'get') {
                apiUrl = apiUrl + this.trim(this._searchKeyword);
            }
            this.service.getDatas(apiUrl, param, this._select.apiType).subscribe((response: any) => {
                if (this._select.selectSource === 'userConfiguredTag') { // 标签移动到分类
                    if (response && response.data && response.data.data && response.data.data.length > 0) {
                        this._options = response.data.data;
                        this._rebuildDatas();
                        this._options = this._removeAttrItem(this._options, -1);
                        /*if (init && this._options.length > 0) {
                            this._initObject();
                        }*/
                    }
                } else {
                    if (response && response.list) {
                        this._options = response.list;
                        this._rebuildDatas();
                        if (init && this._options.length > 0) {
                            this._initObject();
                        }
                        if (init) {
                            this.onBack();
                        }
                    }
                }
            });
        }
    }

    _removeAttrItem(list: any[], value: any) {
        const attr = [];
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (value !== list[i].value) {
                    attr.push(list[i]);
                }
            }
        }
        return attr;
    }
    _getObjByValue(value: any) {
        let obj = null;
        if (value && this._options && this._options.length > 0) {
            for (let i = 0; i < this._options.length; i++) {
                if (value == this._options[i].value) {
                    obj = this._options[i];
                    break;
                }
            }
        }
        return obj;
    }

    _initObject() {
        if (this._select.initValue) {
            const obj = this._getObjByValue(this._select.initValue);
            if (obj) {
                this.selectObject = obj;
            }
        } else {
            this.selectObject = this._options[0];
        }
    }

    _rebuildDatas() {
        if (this._options && this._options.length > 0) {
            for (let i = 0; i < this._options.length; i++) {
                this._options[i].value = this._options[i].value || this._options[i].id;
                this._options[i].label = this._options[i].label ||
                    this._options[i].displayname ||
                    this._options[i].dicItemAlias ||
                    this._options[i].name;
            }
        }
    }

    showSearchPanel() {
        this._isShowOptions = true;
        if (this._searchKeyword) {
            this._searchKeyword = '';
            this.queryData(false);
        }
        this.addEventHandler(document, 'mousedown', this.bindAsEventListener(this, this.hideSearchPanel));
    }

    checkIsSelectByPath(path) {
        let is = false;
        if (path && path.length > 0) {
            for (let i = 0; i < path.length; i++) {
                if (path[i].className && path[i].className.indexOf('dropdown-list') !== -1) {
                    is = true;
                }
            }
        }
        return is;
    }

    hideSearchPanel($event) {
        if (this.checkIsSelectByPath($event.path)) {
            return false;
        }
        this._isShowOptions = false;
        this.removeEventHandler(document, 'mousedown', this.bindAsEventListener(this, null));
    }

    bindAsEventListener = function (object, fun) {
        return function (event) {
            return fun.call(object, (event || window.event));
        };
    };

    seletedOptionItem($event, option: any) {
        this.selectObject = option;
        this._isShowOptions = false;
        this.onBack();
    }

    addEventHandler(oTarget, sEventType, fnHandler) {
        if (oTarget.addEventListener) {
            oTarget.addEventListener(sEventType, fnHandler, true);
        } else if (oTarget.attachEvent) {
            oTarget.attachEvent('on' + sEventType, fnHandler);
        } else {
            oTarget['on' + sEventType] = fnHandler;
        }
    }

    removeEventHandler(oTarget, sEventType, fnHandler) {
        if (oTarget.removeEventListener) {
            oTarget.removeEventListener(sEventType, fnHandler, true);
        } else if (oTarget.detachEvent) {
            oTarget.detachEvent('on' + sEventType, fnHandler);
        } else {
            oTarget['on' + sEventType] = null;
        }
    }

    onBack() {
        this.onSelect.emit(this.selectObject);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.select) {
            this._select = changes.select.currentValue;
            if (this._select) {
                if (this._select.style) {
                    this._selectStyle = this._select.style;
                }
                this._opacity = this._select.opacity || false;
                this.selectObject = {
                    label: '请选择',
                    value: ''
                };
                this._searchKeyword = '';
                this._isSolid = this._select.solid || false;
                this.queryData(true);
            }
        }
    }

    ngOnInit() {
    }

}

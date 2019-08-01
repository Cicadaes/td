import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Injector} from '@angular/core';
import {AdvancedTransFunnelService} from '../../../advanced-trans-funnel.service';
import {BaseComponent} from '../../../../../common/base-component';

@Component({
    selector: 'app-advanced-trans-funnel-users-table',
    templateUrl: './advanced-trans-funnel-users-table.component.html',
    styleUrls: ['./advanced-trans-funnel-users-table.component.less']
})
export class AdvancedTransFunnelUsersTableComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() table: any;
    @Output() onBack = new EventEmitter<any>();

    _table: any = {
        head: [],
        params: {},
        reload: false
    };
    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    _sortValue: any = 'descend';
    _sortField: string;

    _tableHeadList: any[] = [];
    _tableBodyData: any;
    _isSelectedTdId: boolean;
    _tableHeadFixed: any[];

    nzPageIndexChange(event: any) {
        this._current = event;
    }

    constructor(private service: AdvancedTransFunnelService,
                private injector: Injector) {
        super(injector);
    }

    sort(value: any, fieldName: string) {
        this._sortField = fieldName;
        this._sortValue = value;
        this.refreshData();
    }

    reset() {
        this.refreshData(true);
    }

    refreshData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        const params = this._table.params || {};
        params.page = this._current;
        params.rows = this._pageSize;
        this.service.queryUsers(params).subscribe((response: any) => {
            this.globals.resetBodyStyle();
            this._loading = false;
            if (response && response.list) {
                this._total = response.total;
                this._tableBodyData = this.rebuildTableBodyDatas(response, response.list.length);
                this._dataSet = this._tableBodyData.rows;
                this.onBack.emit(this._total);
            }
            console.dir([response]);
        });
    }

    getObjectByKey(key: any, list: any[]) {
        const obj = {};
        let has = false;
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                for (const o in item) {
                    if (key === item[o].key) {
                        obj[o] = item[o];
                        has = true;
                        break;
                    }
                }
                if (has) {
                    break;
                }
            }
        }
        return obj;
    }

    getObjectKey(object: any) {
        let _key: string;
        if (object) {
            for (const key in object) {
                _key = key;
                break;
            }
        }
        return _key;
    }

    checkHeadIsRepeat(id: any, tableHeadList: any[]) {
        let isRepeat = false;
        if (id && tableHeadList && tableHeadList.length > 0) {
            for (let i = 0; i < tableHeadList.length; i++) {
                if (id === tableHeadList[i].id) {
                    isRepeat = true;
                    break;
                }
            }
        }
        return isRepeat;
    }

    _checkIsSelectedTdId(esfieldname: any, tableHeadList: any[]) {
        let isRepeat = false;
        if (esfieldname && tableHeadList && tableHeadList.length > 0) {
            for (let i = 0; i < tableHeadList.length; i++) {
                if (esfieldname === tableHeadList[i].esfieldname) {
                    isRepeat = true;
                    break;
                }
            }
        }
        return isRepeat;
    }
    rebuildTableHeads(rows: any[]) {
        const tableHead = [];
        this._isSelectedTdId = this._checkIsSelectedTdId('distinctid' , this._tableHeadList);
        if (!this._isSelectedTdId) {
            const distinctidObj = this.getObjectByKey('distinctid', rows);
            const distinctidId = this.getObjectKey(distinctidObj);
            if (!this.checkHeadIsRepeat(distinctidId, tableHead)) {
                tableHead.push({
                    displayType: 'String',
                    displayname: 'TDID',
                    esfieldname: 'distinctid',
                    id: distinctidId
                });
            }
        }
        const accountoffsetObj = this.getObjectByKey('accountoffset', rows);
        const accountoffsetId = this.getObjectKey(accountoffsetObj);
        if (!this.checkHeadIsRepeat(accountoffsetId, tableHead)) {
            tableHead.push({
                displayType: 'String',
                displayname: 'accountoffset',
                esfieldname: 'accountoffset',
                id: accountoffsetId
            });
        }
        const offsetObj = this.getObjectByKey('offset', rows);
        const offsetId = this.getObjectKey(offsetObj);
        if (!this.checkHeadIsRepeat(offsetId, tableHead)) {
            tableHead.push({
                displayType: 'String',
                displayname: 'offset',
                esfieldname: 'offset',
                id: offsetId
            });
        }
        const accounttypeObj = this.getObjectByKey('accounttype', rows);
        const accounttypeId = this.getObjectKey(accounttypeObj);
        if (!this.checkHeadIsRepeat(accounttypeId, tableHead)) {
            tableHead.push({
                displayType: 'String',
                displayname: 'accounttype',
                esfieldname: 'accounttype',
                id: accounttypeId
            });
        }
        return tableHead;
    }

    rebuildTableBodyDatas(data: any, columnLength: number) {
        const result: any = {
            total: 0,
            rows: []
        };
        if (
            data
            && data.list
            && data.list.length > 0
//      && this._tableHeadList.length > 0
        ) {
            result.total = data.total;
            const rows = data.list;
            const tableHeadFixed = this.rebuildTableHeads(rows);
            this._tableHeadFixed = tableHeadFixed;
            const tableHead = this._tableHeadList;
            const allHead = tableHeadFixed.concat(tableHead);
            result.rows = this._buildRowItem(rows, allHead);
        }
        return result;
    }

    _buildRowItem(rows: any[], tableHead: any[]) {
        const resultRows = [];
        if (rows && rows.length > 0 && tableHead && tableHead.length > 0) {
            const tableHeadLength = tableHead.length;
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const rowItem = {};
                for (let j = 0; j < tableHeadLength; j++) {
                    let key = tableHead[j].id;
                    if (key) {
                        key = key.toString();
                    }
                    let rowKey = 'key' + key;
                    if (tableHead[j].esfieldname === 'distinctid') {
                        rowKey = 'key0';
                    } else if (tableHead[j].esfieldname === 'accountoffset') {
                        rowKey = 'key01';
                    } else if (tableHead[j].esfieldname === 'offset') {
                        rowKey = 'key02';
                    } else if (tableHead[j].esfieldname === 'accounttype') {
                        rowKey = 'key03';
                    }
                    if (tableHead[j].id) {
                        rowItem[rowKey] = row[tableHead[j].id];
                    } else if (key) {
                        rowItem[rowKey] = row[key];
                    }
                }
                resultRows.push(rowItem);
            }
        }
        return resultRows;
    }

    _buildTableHead() {
        this._tableHeadList = this._table.head;
    }

    goUserProfilePage(param: any) {
        this.globals.resetBodyStyle();
        const params = {};
        if (param) {
            for (const key in param) {
                const o = param[key];
                if (
                    o && (
                        o.key === 'distinctid' ||
                        o.key === 'accountoffset' ||
                        o.key === 'offset' ||
                        o.key === 'accounttype' ||
                        o.key === 'accountid'
                    )
                ) {
                    let oKey = o.key;
                    if (oKey === 'distinctid') {
                        oKey = 'distinctId';
                    } else if (oKey === 'accountoffset') {
                        oKey = 'accountOffset';
                    } else if (oKey === 'accounttype') {
                        oKey = 'accountType';
                    } else if (oKey === 'accountid') {
                        oKey = 'accountId';
                    }
                    if (o.value) {
                        params[oKey] = o.value;
                    }
                }
            }
        }

        this.commonService.goInto({
            name: '用户档案',
            url: `/user/user-profile`,
            params: params
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.globals.resetBodyStyle();
        if (changes.table) {
            this._table = changes.table.currentValue;
        }

        if (this._table) {
            this._buildTableHead();
            if (this._table.reload) {
                this.refreshData();
            } else {
                this.reset();
            }
        }
    }

    ngOnInit() {
    }

}

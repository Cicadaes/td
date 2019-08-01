import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {PagePathService} from '../page-path.service';
import {Globals} from '../../../utils/globals';

@Component({
    selector: 'app-page-path-filter',
    templateUrl: './page-path-filter.component.html',
    styleUrls: ['./page-path-filter.component.less']
})
export class PagePathFilterComponent implements OnInit, OnChanges {
    @Input() needSearch: boolean;
    @Output() onBack = new EventEmitter<any>();
    _searchData: any;
    _selectGroup: any;
    _selectGroupValue: any;
    _profilemetaType: any;
    _selectOperator: any;
    _selectOperatorValue: any;
    _selectDic: any;
    _selectDicOptions: any;
    _needSearch: boolean;

    constructor(private service: PagePathService, public globals: Globals) {
    }

    search() {
        this._searchData = {
            productId: this.globals.getProductIdByStorage(),
            dateField: this._selectGroupValue,
            profilemetaType: this._profilemetaType,
            operator: this._selectOperatorValue,
            list: []
        };
        if (this._selectDicOptions && this._selectDicOptions.length > 0) {
            for (let i = 0; i < this._selectDicOptions.length; i++) {
                const option = this._selectDicOptions[i];
                this._searchData.list.push({
                    eventId: option.value,
                    eventFiled: option.label,
                    dicId: option.dicId,
                    dicItemKey: option.dicItemKey,
                    dicItemValue: option.dicItemValue
                });
            }
        }
        this.onBack.emit(this._searchData);
    }

    onSelectOperator(value: any) {
        this._selectOperatorValue = value;
    }

    onSelectEventMultiple(value: any) {
        this._selectDicOptions = value;
        console.dir([value]);
    }

    onSelectGroup(data: any) {
        const value = data.esfieldname;
        this._profilemetaType = data.profilemetaType || '';
        this._selectGroupValue = value;
        this._selectOperatorValue = '=';
        this._selectDicOptions = null;
        this.initSelectOperator();
        this._selectDic = null;
        setTimeout(() => {
            this._selectDic = {
                initValue: null,
                model: 'multiple',
                apiData: true,
                solid: true,
                apiType: 'get',
                apiUrl: this.service.queryDictionarysUrl + '?dicKey=' + value + '&rows=20&page=',
                apiSearch: true,
                keywordFiled: 'searchName',
                apiPaging: true,
                apiParam: {}
            };
        }, 200);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.needSearch) {
            this._needSearch = changes.needSearch.currentValue;
            if (this._needSearch) {
                this.search();
            }
        }
    }

    initSelectOperator() {
        this._selectOperator = {
            apiData: false,
            initValue: '=',
            selectOptions: [{
                value: '=',
                label: '等于'
            }, {
                value: '!=',
                label: '不等于'
            }]
        };
    }

    ngOnInit() {
        this._selectGroup = {
            apiUrl: this.service.querySelectGroupUrl,
            apiType: 'get',
            apiParam: {}
        };
        this.initSelectOperator();
    }

}

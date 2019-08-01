import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {SelectSearchService} from './select-search.service';
import {BehaviorSubject} from '../../../../../node_modules/rxjs';

@Component({
    selector: 'app-select-search',
    templateUrl: './select-search.component.html',
    styleUrls: ['./select-search.component.less'],
    providers: [SelectSearchService],
})
export class SelectSearchComponent implements OnInit, OnChanges {
    @Input() select: any;
    @Input() selectDisabled: boolean;
    @Output() onSelect = new EventEmitter<any>();
    @Output() selectOption = new EventEmitter<any>();
    @Output() selectOptions = new EventEmitter<any>();

    @Output() refreshOptions = new EventEmitter<any>();
    searchValue: any;

    selectedOptionValue: any;
    selectedOption: any;
    searchOptions: any = [];
    dataList: any = [];
    _select: any = {};
    _size: any = 'default';
    isLoading = false;
    _originData: boolean;

    @Input() set refresh(_refresh: EventEmitter<any>) {
        _refresh && _refresh.subscribe && _refresh.subscribe((data: any) => {
            this.querySelectDatas('');
        });
    }


    constructor(private service: SelectSearchService) {
    }

    onSearch(value: string): void {
        if (this._originData) {
            console.log(value);
            this.searchValue = value;
            this.querySelectDatas('search');
        }
    }

    searchChange(searchText: any) {
        const data$ = Observable.create((observer: any) => {
            observer.next(this.dataList);
        }).throttleTime(1000).map((heroes: any) => {
            return heroes.filter((item: any) => {
                return new RegExp(searchText, 'gi').test(item.label);
            });
        }).delay(2000);
        data$.subscribe((result: any) => {
            this.searchOptions = result;
        });
    }

    querySelectDatas(value: any) {
        if (this.select && this.select.originData) {
            if (this.select && this.select.apiData) {
                let apiUrl = this.select.apiUrl;
                if (value && value === 'search') {
                    if (this.searchValue) {
                        this.dataList = [];
                        if (this.select.apiType === 'get') {
//                            apiUrl = apiUrl;
                            this.select.apiParam.page = 1;
                            this.select.apiParam['name'] = this.searchValue;
                        }
                    } else {
                        if (this.select.apiType === 'get') {
                            if (this.select.apiParam.hasOwnProperty('name')) {
                                delete this.select.apiParam.name;
                                this.select.apiParam.page = 1;
                            }
//                            apiUrl = apiUrl;
                        }
                    }
                }
                console.log('parmas', this.select.apiParam);
                this.service.getDatas(apiUrl, this.select.apiParam, this.select.apiType).subscribe((response: any) => {
                    if (this.select.app === 'marketing') {
                        if (response && response.data.data && response.data.data.length > 0) {
                            if (this.select.apiParam.page === 1) {
                                this.dataList = [];
                                this.dataList.push({
                                    value: '',
                                    label: '全部'
                                });
                            }
                            for (let i = 0; i < response.data.data.length; i++) {
                                const obj = {
                                    'value': response.data.data[i]['id'],
                                    'label': response.data.data[i]['name']
                                };
                                this.dataList.push(obj);
                            }

                            this.isLoading = false;
                        } else {
                            this.isLoading = false;
                        }
                        this.searchOptions = this.dataList;
                        this.rebuildOptions();
                        if (this.searchOptions && this.searchOptions.length > 0) {
                            this.selectedOptionValue = this.searchOptions[0].value || '';
                            this.selectedOption = this.searchOptions[0];
                        }
                        this.onBack();
                    } else {
                        if (response && response.list) {
                            this.dataList = response.list;
                            if (this.select.apiData && this.select.search) {
                                this.dataList.unshift({label: '全部', value: ''});
                            }
                            this.searchOptions = this.dataList;
                            this.rebuildOptions();
                            if (this.searchOptions && this.searchOptions.length > 0) {
                                this.selectedOptionValue = this.searchOptions[0].value || '';
                                this.selectedOption = this.searchOptions[0];
                            }
                            this.onBack();
                        }
                    }
                });
            } else if (this.select) {
                this.dataList = this.select.selectOptions;
                this.searchOptions = this.dataList;
                this.onBack();
            }
        } else {
            this.dataList = [];
            if (this.select && this.select.apiData) {
                this.searchOptions = [];
                const apiUrl = this.select.apiUrl;
                /*if (this.select.apiType === 'get') {
                    apiUrl = apiUrl + value;
                }*/
                this.service.getDatas(apiUrl, this.select.apiParam, this.select.apiType).subscribe((response: any) => {
                    if (this.select.app === 'marketing') {
                        this.dataList = [];
                        if (response && response.data.data) {
                            this.dataList.push({
                                value: '',
                                label: '全部'
                            });
                            for (let i = 0; i < response.data.data.length; i++) {
                                const obj = {
                                    'value': response.data.data[i]['id'],
                                    'label': response.data.data[i]['name']
                                };
                                this.dataList.push(obj);
                            }
                        }
                        this.searchOptions = this.dataList;
                        this.rebuildOptions();
                        if (this.searchOptions && this.searchOptions.length > 0) {
                            this.selectedOptionValue = this.searchOptions[0].value || '';
                            this.selectedOption = this.searchOptions[0];
                        }
                        this.onBack();
                    } else {
                        if (response && response.list) {
                            this.dataList = response.list;
                            if (this.select.apiData && this.select.search) {
                                this.dataList.unshift({label: '全部', value: ''});
                            }
                            this.searchOptions = this.dataList;
                            this.rebuildOptions();
                            if (this.searchOptions && this.searchOptions.length > 0) {
                                this.selectedOptionValue = this.searchOptions[0].value || '';
                                this.selectedOption = this.searchOptions[0];
                            }
                            this.onBack();
                        }
                    }
                });
            } else if (this.select) {
                this.dataList = this.select.selectOptions;
                this.searchOptions = this.dataList;
                this.onBack();
            }
        }
    }

    rebuildOptions() {
        if (this.searchOptions && this.searchOptions.length > 0) {
            for (let i = 0; i < this.searchOptions.length; i++) {
                this.searchOptions[i].value = this.searchOptions[i].value || this.searchOptions[i].id || '';
                this.searchOptions[i].label = this.searchOptions[i].label || this.searchOptions[i].dicItemAlias || '';
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.select) {
            this._select = changes.select.currentValue;
            if (this._select && this._select.size) {
                this._size = this._select.size;
            }
            if (this.select && this.select.originData) {
                this._originData = this.select.originData;
            }
            if (this._select) {
                this.selectedOptionValue = this.select.initValue;
                this.querySelectDatas('');
            }
        }

        console.log(this.select);
    }

    getOptionByValue() {
        if (this.selectedOptionValue && this.dataList && this.dataList.length > 0) {
            for (let i = 0; i < this.dataList.length; i++) {
                if (this.selectedOptionValue === this.dataList[i].value) {
                    this.selectedOption = this.dataList[i];
                    break;
                }
            }
        }
    }

    loadMore() {
        if (this.searchOptions.length > 0 && (this.searchOptions.length < 10 * (this.select.apiParam.page) + 1)) {
            this.isLoading = false;
            return;
        }
        this.isLoading = true;
        this.select.apiParam.page++;
        this.querySelectDatas('');
    }

    ngOnInit() {
        /*    this.querySelectDatas('');
            if (this.select) {
              this.selectedOptionValue = this.select.initValue || '';
            }
            this.onSelect.emit(this.selectedOptionValue);
            this.selectOptions.emit(this.dataList);*/
    }

    onBack() {
        this.getOptionByValue();
        this.onSelect.emit(this.selectedOptionValue);
        this.selectOption.emit(this.selectedOption);
        this.selectOptions.emit(this.dataList);
    }

    changeSelect(data: any) {
        this.selectedOptionValue = data;
        this.onBack();
    }
}

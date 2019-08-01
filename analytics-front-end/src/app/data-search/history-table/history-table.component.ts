import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Injector } from '@angular/core';
import { DataSearchService } from '../data-search.service';
import { BaseComponent } from '../../common/base-component';
import { Globals } from '../../utils/globals';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.less'],
  providers: [DataSearchService]
})
export class HistoryTableComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() tagCate: any;
  @Input() tenantAdmin: any;
  @Output() onLoadTagCate = new EventEmitter<any>();
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  dataSet = [];
  loading = true;

  _moreSearchFieldArray: any[] = [];
  _queryParam: any = {};
  _tagCate: any = {};
  _keyword: string;
  _showMoreSearch: boolean;

  allChecked = false;
  indeterminate = false;

  _isVisible: boolean;

  constructor(public globals: Globals, private injector: Injector) {
    super(injector);
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    const param = this._queryParam || {};
    param.productId = this.globals.getProductIdByStorage();
    param.page = this.pageIndex;
    param.rows = this.pageSize;
    param.customTagCategoryId = this._tagCate.id;
    if (!param.name) {
      param.name = this._keyword;
    }
    this.loading = false;
    /*this.service.query(param).subscribe((response: any) => {
            this.loading = false;
            if (response && response.code === 200) {
                this.total = response.data.total;
                this.dataSet = response.data.rows;
            }
        });*/
  }

  _onSearch(value: any) {
    this._queryParam = {};
    this._keyword = value || '';
    this.searchData(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    /*if (changes.tagCate && changes.tagCate.currentValue) {
            this._tagCate = changes.tagCate.currentValue;
            if (this._tagCate) {
                this._showMoreSearch = false;
                this._keyword = '';
                this._queryParam = {};
                this.searchData(true);
            }
        }
        if (changes.tenantAdmin && changes.tenantAdmin.currentValue) {
            this._tenantAdmin = changes.tenantAdmin.currentValue;
        }*/
  }

  ngOnInit(): void {
    this.searchData(true);
  }
}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectSearchMultipleService } from './select-search-multiple.service';

@Component({
  selector: 'app-select-search-multiple',
  templateUrl: './select-search-multiple.component.html',
  styleUrls: ['./select-search-multiple.component.less'],
  providers: [SelectSearchMultipleService]
})
export class SelectSearchMultipleComponent implements OnInit, OnChanges {
  @Input() select: any;
  @Output() onSelect = new EventEmitter<any>();

  selectedOption: any;
  searchOptions: any;
  _allOptions: any[] = [];
  _select: any = {};
  _size: any = 'default';

  isLoading = false;
  isSearchMore = true;
  _searchKeyword: string;
  _currentPage: number;
  _totalPage: number;
  _model: string;

  constructor(private service: SelectSearchMultipleService) {}

  trim(str: string) {
    if (str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    } else {
      return '';
    }
  }

  onSearch(value: string): void {
    this._searchKeyword = this.trim(value);
    //    this.filterSelectOptions(this._searchKeyword, this.searchOptions);
    this.querySelectDatas(true, false);
  }

  filterSelectOptions(keyword: string, list: any) {
    keyword = this.trim(keyword) || '';
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const li = list[i];
        if (li.label && li.label.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          li.isShow = true;
        } else {
          li.isShow = false;
        }
      }
    }
  }

  loadMore() {
    if (!this.isSearchMore) {
      return false;
    }
    this.querySelectDatas(false, true);
  }

  querySelectDatas(isSearch: boolean, isMore: boolean) {
    if (isSearch) {
      this._currentPage = 1;
      this.searchOptions = [];
    }
    if (this.select && this.select.apiData) {
      let apiUrl = this._select.apiUrl;
      const param = this._select.apiParam || {};
      if (this._select.apiPaging) {
        if (this._select.apiType === 'get') {
          apiUrl = apiUrl + this._currentPage;
        } else {
          param.page = this._currentPage;
        }
      }
      if (this._select.apiSearch) {
        if (this._select.apiType === 'get') {
          if (this._select.keywordFiled) {
            apiUrl = `${apiUrl}&${this._select.keywordFiled}=${this._searchKeyword}`;
          } else {
            apiUrl = `${apiUrl}${this._searchKeyword}`;
          }
        } else {
          if (this._select.keywordFiled) {
            param[this._select.keywordFiled] = this._searchKeyword;
          } else {
            param.keyword = this._searchKeyword;
          }
          if (isSearch || isMore) {
            param.ids = '';
          }
        }
      }

      if (this.isLoading) {
        return false;
      }
      this.isLoading = true;
      this.service.getDatas(apiUrl, param, this.select.apiType).subscribe((response: any) => {
        this.isLoading = false;
        //this._totalPage = Math.ceil(response.total / 20);
        this._currentPage++;
        if (response && response.list && response.list.length > 0) {
          this.rebuildOptions(response.list);
          this.initSelectValues(isSearch, isMore);
          this.isSearchMore = true;
        } else {
          this.isSearchMore = false;
        }
        this.onBack();
      });
    } else if (this.select) {
      this.isLoading = false;
      this.searchOptions = this.select.selectOptions || [];
      this.onBack();
    }
  }

  getOptionByValue(value: any) {
    let option;
    if (value && this._allOptions && this._allOptions.length > 0) {
      value = value.toString();
      for (let i = 0; i < this._allOptions.length; i++) {
        if (parseFloat(value) === this._allOptions[i].value) {
          option = this._allOptions[i];
          break;
        }
      }
    }
    return option;
  }

  initSelectValues(isSearch: boolean, isMore: boolean) {
    if (!isSearch && !isMore) {
      if (this._select.initValue) {
        if (this._model === 'multiple') {
          this.selectedOption = [];
          if (this._select.initValue.length > 0) {
            for (let i = 0; i < this._select.initValue.length; i++) {
              const value = this._select.initValue[i].toString();
              this.selectedOption.push(parseFloat(value));
            }
          }
        } else {
          const value = this._select.initValue.toString();
          this.selectedOption = parseFloat(value);
        }
      } else {
        if (this._select.initFirst) {
          if (this._model !== 'multiple' && this.searchOptions && this.searchOptions.length > 0) {
            this.selectedOption = this.searchOptions[0].value;
          }
        }
      }
    }
  }

  _checkIsInOptions(value: any) {
    let isIn = false;
    if (value && this.searchOptions && this.searchOptions.length > 0) {
      for (let i = 0; i < this.searchOptions.length; i++) {
        if (value === this.searchOptions[i].value) {
          isIn = true;
          break;
        }
      }
    }
    return isIn;
  }

  rebuildOptions(list: any) {
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const li = list[i];
        li.value = li.value || li.id || '';
        li.label = li.label || li.dicItemAlias || '';
        li.isShow = true;
        const isIn = this._checkIsInOptions(li.value);
        if (!isIn) {
          this.searchOptions.push(li);
        }
      }
    }
  }

  _getCallBackOptions() {
    let data;
    if (this._model === 'multiple') {
      data = [];
      if (this.selectedOption && this.selectedOption.length > 0) {
        for (let i = 0; i < this.selectedOption.length; i++) {
          if (this.getOptionByValue(this.selectedOption[i])) {
            data.push(this.getOptionByValue(this.selectedOption[i]));
          }
        }
      }
    } else {
      data = {};
      if (this.selectedOption && this.getOptionByValue(this.selectedOption)) {
        data = this.getOptionByValue(this.selectedOption);
      }
    }
    return data;
  }

  onBack() {
    this._allOptions = this._allOptions.concat(this.searchOptions);
    this._allOptions = this.arrUniqueByAttr(this._allOptions, 'value');
    const backDatas = this._getCallBackOptions();
    this.onSelect.emit(backDatas);
  }

  /**
   * 数组对象去重（根据属性）
   * @param arr
   * @param name
   */
  arrUniqueByAttr(arr, name) {
    const hash = {};
    return arr.reduce((item, next) => {
      if (!hash[next[name]]) {
        hash[next[name]] = true && item.push(next);
      }
      return item;
    }, []);
  }

  changeSelect(data: any) {
    setTimeout(() => {
      this.onBack();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    this._searchKeyword = '';
    this.selectedOption = null;
    if (changes.select) {
      this._select = changes.select.currentValue;
      if (this._select && this._select.size) {
        this._size = this._select.size;
      }
      if (this._select && this._select.model) {
        this._model = this._select.model;
      }
      if (this._select) {
        this.searchOptions = [];
        this._currentPage = 1;
        this.querySelectDatas(false, false);
      }
    }
  }

  ngOnInit() {}
}

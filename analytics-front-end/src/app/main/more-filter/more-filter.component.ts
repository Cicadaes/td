import { Component, Injector, OnInit, OnChanges, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { MoreFilterService } from './more-filter.service';
import { BaseComponent } from '../../common/base-component';

@Component({
  selector: 'app-more-filter',
  templateUrl: './more-filter.component.html',
  styleUrls: ['./more-filter.component.less']
})
export class MoreFilterComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() queryParams;
  @Input() showAdd;
  @Output() onFilter = new EventEmitter<any>();

  moreSearchList: any = []; // 更多搜索条件
  leftList: any = []; // 等号左边的下拉框列表
  leftEventList: any = []; // 等号左边的下拉框 事件列表
  filterMap: any = {}; // 等号左边的下拉框map数据 key为esfieldname value为displayType
  isLoadingRightList: boolean;
  _queryParams: any;
  clausesList: any[] = [
    {
      value: 'and',
      label: '且'
    },
    {
      value: 'or',
      label: '或'
    }
  ];

  constructor(private service: MoreFilterService, private injector: Injector) {
    super(injector);
  }

  // 获取用户后面下拉框列表
  getProfilemetasList() {
    if (this._queryParams && this._queryParams.eventId) {
      this.service.getProfilemetasList(this._queryParams).subscribe((data: any) => {
        if (data && data.success) {
          this.leftList = [];
          this.filterMap = {};
          if (data.list) {
            for (const key in data.list) {
              if (data.list.hasOwnProperty(key)) {
                const json = {
                  key: key,
                  value: data.list[key]
                };
                this.leftList.push(json);
                if (key === '事件属性') {
                  this.leftEventList = data.list[key];
                }
                const tmpLength = data.list[key].length;
                for (let i = 0; i < tmpLength; i++) {
                  this.filterMap[data.list[key][i].esfieldname] = data.list[key][i].displayType;
                }
              }
            }

            this.moreSearchList = [
              {
                clauses: 'and',
                filter: this.leftList[0] ? this.leftList[0].value[0] : '',
                operator: 'eq',
                rightList: []
              }
            ];
            this.getRightList(0, this.moreSearchList, []);
          }
        }
      });
    }
  }

  changeEvent(e: any, index: number, item: any) {
    item.page = 1;
    this.moreSearchList[index].filter = e;
    delete this.moreSearchList[index].values;
    delete this.moreSearchList[index].operator;
    delete this.moreSearchList[index].first;
    delete this.moreSearchList[index].second;
    this.moreSearchList[index].operator = 'eq';
    this.moreSearchList[index]['rightList'] = [];
    this.getRightList(index, item, []);
  }

  _arrToString(list: any[]) {
    let str = '';
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (i === list.length - 1) {
          str += list[i];
        } else {
          str += list[i] + ',';
        }
      }
    }
    return str;
  }

  _getOptionById(id: any, list: any[]) {
    let option;
    if (id && list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          option = list[i];
          break;
        }
      }
    }
    return option;
  }

  // 获取最后一个下拉框列表
  getRightList(index: number, item: any, values: any[]) {
    let page = item.page;
    if (!page) {
      item.page = 1;
      page = 1;
    }
    const ids = this._arrToString(values);
    const tempJson = {
      page: page,
      rows: 20,
      sort: 'dic_item_alias',
      order: 'asc',
      searchName: item.searchName || '',
      dicKey: this.moreSearchList[index].filter['esfieldname'],
      ids: ids
    };
    if (tempJson.dicKey === '_td_crowd') {
      // 用户群
      tempJson.sort = 'create_time';
      tempJson.order = 'desc';
    }
    this.isLoadingRightList = true;
    this.service.getEventList(tempJson).subscribe(
      (data: any) => {
        this.isLoadingRightList = false;
        if (data.success) {
          item.page++;
          if (item.searchName && page == 1) {
            this.moreSearchList[index]['rightList'] = [];
          }
          if (data.list && data.list.length > 0) {
            for (let i = 0; i < data.list.length; i++) {
              const option = this._getOptionById(data.list[i].id, this.moreSearchList[index]['rightList']);
              if (!option) {
                const json = { value: data.list[i].id, name: data.list[i].dicItemAlias };
                this.moreSearchList[index]['rightList'].push(json);
              }
            }
          }

          // console.log(this.moreSearchList[index]['rightList']);
        }
      },
      (err: any) => {
        this.isLoadingRightList = false;
      }
    );
  }

  // 添加更多搜索条件
  add() {
    const that = this;
    that.moreSearchList.push({
      clauses: that.moreSearchList[0].clauses,
      filter: that.leftList[0] ? that.leftList[0].value[0] : '',
      operator: 'eq',
      rightList: []
    });
    that.getRightList(that.moreSearchList.length - 1, that.moreSearchList[that.moreSearchList.length - 1], []);
  }

  removeItem(index: number) {
    this.moreSearchList.splice(index, 1);
    /*if (this.moreSearchList.length === 0) {
            this.moreSearchFlag = !this.moreSearchFlag;
            this.search();
        }*/
  }

  formatterInputNumber(value: any, item: any) {
    if (value && item && item.filter) {
      if (item.filter.displayType === 'Integer' && value.toString().indexOf('.') !== -1) {
        setTimeout(() => {
          item.values = parseInt(value.toString(), 10);
        }, 10);
      }
    }
  }

  onSearchEventAttr(value: any, index: number, item: any) {
    item.searchName = value || '';
    item.page = 1;
    this.moreSearchList[index]['rightList'] = [];
    this.getRightList(index, item, []);
  }

  loadMore(index: number, item: any) {
    this.getRightList(index, item, []);
  }

  changeClauses(value: any) {
    if (value) {
      this.moreSearchList.forEach(element => {
        element.clauses = value;
      });
    }
  }

  checkEventFilter(esfieldname: string) {
    let eventFilter = false;
    if (this.leftEventList && this.leftEventList.length > 0) {
      for (let i = 0; i < this.leftEventList.length; i++) {
        if (this.leftEventList[i].esfieldname === esfieldname) {
          eventFilter = true;
          break;
        }
      }
    }
    return eventFilter;
  }

  rebuildQueryFilters(list: any[]) {
    const queryFilters = [];
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const filter = {
          clauses: item.clauses,
          filter: '',
          operator: item.operator,
          values: [],
          eventFilter: false,
          displayType: ''
        };
        if (item.filter) {
          filter.eventFilter = this.checkEventFilter(item.filter['esfieldname']);
          filter.displayType = item.filter['displayType'];
          filter.filter = item.filter['esfieldname'];

          if (item.filter.displayType === 'Date') {
            const temp = [];
            if (item.operator === 'range') {
              if (item.values && item.values.length > 1) {
                temp[0] = this.globals.dateFormat(item.values[0], '');
                temp[1] = this.globals.dateFormat(item.values[1], '');
              }
            } else {
              if (item.value) {
                temp.push(this.globals.dateFormat(item.value, ''));
              }
            }
            filter.values = temp;
          } else if (item.filter.displayType === 'Integer' || item.filter.displayType === 'Double') {
            const temp = [];
            if (item.operator === 'range') {
              let first = null;
              if (item.first || item.first === 0) {
                first = item.first;
              }
              let second = null;
              if (item.second || item.second === 0) {
                second = item.second;
              }
              temp.push(first);
              temp.push(second);
            } else {
              if (item.values || item.values === 0) {
                temp.push(item.values);
              }
            }
            filter.values = temp;
          } else if (item.filter.displayType === 'Tag') {
            filter.values = item.values || [];
          } else if (item.filter.displayType === 'String') {
            if (item.values) {
              filter.values.push(item.values);
            }
          }
        }
        queryFilters.push(filter);
      }
    }
    return queryFilters;
  }

  search() {
    const queryFilters = this.rebuildQueryFilters(this.moreSearchList);
    this.onFilter.emit(queryFilters);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryParams) {
      this._queryParams = changes.queryParams.currentValue;
    }
    this.getProfilemetasList();
  }
}

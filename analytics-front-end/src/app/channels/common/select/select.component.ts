import { Component, OnInit, EventEmitter, Input, Output, Injector } from '@angular/core';
import { subcontractChannelsService } from './../../subcontract-channels/subcontract-channels.service';
import { BaseComponent } from './../../../common/base-component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'common-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less']
})
export class selectComponent extends BaseComponent implements OnInit {
  searchTerms = new Subject<string>();
  listOfSelectedValue = []; //当前筛选条件
  longRangeSearch: boolean = true; //远程搜索加载数据  true:不加载  false:加载
  listOfOptionSearchLoading: boolean = true; //远程搜索加载数据时的loading状态  true:加载  false:不加载
  listOfOptionSearch: any = []; //select远程数据加载
  longRangeSearchLoading: boolean = true; //select是否显示loading
  listOfOption = []; //下拉框数据
  listOfOptionList: any; //下拉框数据总数
  centerValue: any; //暂存数据
  changeValue: any = false; //是否改变
  dickey: any; //判断人群;推广渠道;推广媒介;活动名称;关键词;创意版本
  name: any; //label名称
  nzDisabled: boolean; //是否禁用
  all: boolean; //是否显示全部
  page: number; //下拉框第几页
  searchText: any; //搜索字符
  constructor(private subcontractChannelsService: subcontractChannelsService, private Injector: Injector) {
    super(Injector);
  }
  ngOnInit() {
    this.page = 1;
    this.subcontractSelect();
    this.searchTerms
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this._searchChange(term);
      });
  }

  @Input()
  set All(data: any) {
    if (data) {
      this.all = true;
    } else {
      this.all = false;
    }
  }
  @Input()
  set dicKey(data: any) {
    this.dickey = data;
  }
  @Input()
  set _name(data: any) {
    this.name = data;
  }
  @Input()
  set disabled(data: any) {
    if (data) {
      this.nzDisabled = true;
    } else {
      this.nzDisabled = false;
    }
  }
  @Input()
  set selectData(data: any) {
    if (data && data.length) {
      this.listOfSelectedValue = data;
    } else {
      this.centerValue = null;
    }
  }
  @Output() _selctChange = new EventEmitter();
  /**
   * 分包渠道select筛选器值
   */
  subcontractSelect(loading: boolean = false) {
    if (!loading) {
      this.listOfOption = [];
    }
    this.listOfOptionList = 0;
    let parme = {
      page: loading ? this.page : 1,
      pageSize: 20,
      product_id: localStorage.getItem('productId'),
      cubeId: 296,
      dicKey: this.dickey
    };
    this.subcontractChannelsService.checkCrowdName(parme).subscribe((response: any) => {
      if (response && response.success) {
        this.listOfOptionList = response.total;
        if (this.listOfOptionList) {
          let length = response.data.length;
          let lists = [];
          for (let i = 0; i < length; i++) {
            lists.push({
              value: response.data[i].id,
              label: response.data[i].dicItemValue
            });
          }
          // if (this.all && !loading) {
          //   lists.unshift({ value: '', label: '全部' });
          // }
          this.listOfOption = [...this.listOfOption, ...lists];
          // tslint:disable-next-line:max-line-length
          if (this.listOfOption && this.listOfOption.length >= this.listOfOptionList) {
            this.longRangeSearchLoading = false;
          } else {
            this.longRangeSearchLoading = true;
          }
        } else {
          this.listOfOption = [];
          this.listOfSelectedValue = [];
          this.longRangeSearchLoading = false;
        }
      }
    });
  }
  /**
   * 搜索
   * @param searchText
   */
  _searchChange(searchText: any) {
    this.longRangeSearch = false;
    this.listOfOptionSearchLoading = true;
    let parme = {
      cubeId: 296,
      dicKey: this.dickey,
      product_id: localStorage.getItem('productId'),
      dicItemValue: searchText,
      page: 1,
      pageSize: 500
    };
    this.subcontractChannelsService.checkCrowdName(parme).subscribe((response: any) => {
      if (response && response.success) {
        this.listOfOptionList = response.total;
        if (this.listOfOptionList) {
          let length = response.data.length;
          let lists = [];
          for (let i = 0; i < length; i++) {
            lists.push({
              value: response.data[i].id,
              label: response.data[i].dicItemValue
            });
          }
          this.listOfOptionSearch = lists;
          this.listOfOptionSearchLoading = false;
        } else {
          this.listOfOptionSearch = [];
          this.listOfOptionSearchLoading = false;
        }
      } else {
        this.listOfOptionSearch = [];
        this.listOfOptionSearchLoading = false;
      }
    });
  }
  /**
   * 远程搜索
   * @param searchText
   */
  searchChange(searchText: any) {
    searchText = this.trim(searchText);
    if (searchText) {
      this.searchTerms.next(searchText);
    } else {
      this.longRangeSearch = true;
    }
  }
  /**
   * selsect到底部回调
   */
  scrollToBottom() {
    if (this.longRangeSearchLoading) {
      this.page = this.page + 1;
      this.subcontractSelect(true);
    }
  }
  /**
   * 分包渠道select筛选器change
   * @param data
   */
  listOfSelectedValueChange(data: any) {
    if (this.listOfSelectedValue && this.listOfSelectedValue.length > 1) {
      let index = this.listOfSelectedValue.indexOf('');
      if (index !== -1 && index == 0) {
        this.listOfSelectedValue.splice(index, 1);
      } else if (index !== -1) {
        this.listOfSelectedValue = [''];
      }
    }
    // tslint:disable-next-line: max-line-length
    if (
      this.centerValue &&
      this.listOfSelectedValue &&
      this.centerValue.toString() !== this.listOfSelectedValue.toString()
    ) {
      if (!this.changeValue) {
        this.close(false);
      } else {
        this.close(this.changeValue, 'change');
      }
    }
  }
  /**
   *
   * 搜索库那个筛选器下拉菜单打开状态变化回调
   */
  close(key: any, cont?: any) {
    this.changeValue = key;
    switch (key) {
      case true:
        if (!cont) {
          this.centerValue = this.listOfSelectedValue;
        }
        break;
      case false:
        // tslint:disable-next-line:max-line-length
        if (
          this.centerValue &&
          this.listOfSelectedValue &&
          this.centerValue.toString() !== this.listOfSelectedValue.toString()
        ) {
          this._selctChange.emit(this.listOfSelectedValue);
          this.centerValue = this.listOfSelectedValue;
        }
        break;
      default:
        break;
    }
  }
}

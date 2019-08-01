import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { PagePathService } from '../page-path.service';
import { PagePathComService } from './page-path-com.service';
import { Globals } from '../../../utils/globals';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-page-path-com',
  templateUrl: './page-path-com.component.html',
  styleUrls: ['./page-path-com.component.less'],
  providers: [PagePathComService]
})
export class PagePathComComponent implements OnInit, OnChanges {
  @Input() filter: any;
  _pagePathFilter: any;
  _containerStyle = {
    height: ''
  };
  subscription: Subscription;
  rootList: any;
  showLeft: boolean = true;
  _pagePathDatas: any;
  _allPages: any;
  _pageId: any;
  _pageName: string;
  _currentPage: number;
  _cmData = {
    right: [],
    left: []
  };
  _searchPageWord: any;

  _isQueriedData: boolean;
  _childrenData: any;
  _childrenLevel: number;

  constructor(
    private service: PagePathService,
    private pagePathComService: PagePathComService,
    public globals: Globals
  ) {
    // 截取根目录列表
    this.loopList(this._cmData.right);
    // 左侧显示隐藏
    // this.subscription = this.pagePathComService.missionShowLeft$.subscribe((state: boolean) => {
    //     this.showLeft = state;
    // });
    // 切换根目录
    this.subscription = this.pagePathComService.missionSwitchRoot$.subscribe((data: any) => {
      this._searchPageWord = '';
      console.dir([data]);
      this._currentPage = 1;
      this._allPages = [];
      this.queryAllPages(false, false);
      if (data) {
        this._pageId = data.id;
        this._pageName = data.dicItemValue;
        //                this.queryComDatas(false);
      }
      //             if (this._allPages && this._allPages.length > 0) {
      //                 if (!this._pageId) {
      //                     this._pageId = this._allPages[0].value;
      //                     this._pageName = this._allPages[0].dicItemValue;
      //                 }
      //                 this.queryComDatas(false);
      //             } else {
      //                 this._isQueriedData = true;
      //             }
    });
    // 加载子集
    this.subscription = this.pagePathComService.missionLoadData$.subscribe((data: any) => {
      if (data) {
        this.queryChildrenComDatas(data);
      }
    });

    // 加载更多数据
    this.subscription = this.pagePathComService.missionLoadMoreData$.subscribe((data: any) => {
      if (data) {
        this._searchPageWord = '';
        //   console.dir([data]);
        this.queryAllPages(data, false);
      }
    });
    // 搜索数据
    this.subscription = this.pagePathComService.missionOnSearchPageData$.subscribe((data: any) => {
      this._searchPageWord = data;
      this.queryAllPages(false, true);
    });
  }

  loopList(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].list) {
        this.rootList = data[i].list;
        break;
      } else {
        if (data[i].children && data[i].children.length > 0) {
          this.loopList(data[i].children);
        }
      }
    }
  }

  calContainerStyle(): void {
    setTimeout(() => {
      this._containerStyle = {
        height: window.innerHeight - 170 + 'px'
      };
    }, 200);
  }

  listenerWindownResize() {
    this.calContainerStyle();
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(event => {
        this.calContainerStyle();
      });
  }

  queryChildrenComDatas(data: any) {
    if (data) {
      const param = this._pagePathFilter || {};
      param.pageid = data.id;
      param.dicItemValue = data.dicItemValue || '';
      param.productId = this.globals.getProductIdByStorage();
      this.pagePathComService.queryClickPapgePathData(param).subscribe((response: any) => {
        this._childrenData = response;
        this.rendPagePathCom(true);
      });
    }
  }

  queryComDatas(changeData: boolean) {
    const param = this._pagePathFilter || {};
    param.pageid = this._pageId;
    param.dicItemValue = this._pageName;
    param.productId = this.globals.getProductIdByStorage();

    this.service.queryPapgePathData(param).subscribe((response: any) => {
      this._isQueriedData = true;
      if (response && response.right) {
        this._pagePathDatas = response;
        if (!changeData) {
          this.rendPagePathCom(false);
        }
      }
    });
  }

  queryAllPages(loadMore: boolean, onSearch: boolean) {
    if (onSearch) {
      this._currentPage = 1;
      this._allPages = [];
    }
    const param = {
      platformid: this._pagePathFilter.sourceid,
      searchName: this._searchPageWord || '',
      page: this._currentPage || 1,
      rows: 100,
      productid: this.globals.getProductIdByStorage()
    };
    this.service.queryAllPages(param).subscribe((response: any) => {
      this._currentPage++;
      if (response && response.list) {
        this._allPages = response.list;
        this._rebuildAllPages(response.list);
        if (this._allPages && this._allPages.length > 0) {
          if (!this._pageId) {
            this._pageId = this._allPages[0].value;
            this._pageName = this._allPages[0].dicItemValue;
          }
          if (this._cmData.right.length > 0) {
            this._cmData.right[0].list = this._allPages;
            this.loopList(this._cmData.right);
          }
          let changeData = false;
          if (loadMore || onSearch) {
            changeData = true;
          }
          this.queryComDatas(changeData);
        } else {
          this.rootList = [];
          this._isQueriedData = true;
        }
      }
    });
  }

  _checkIsInOptions(value: any) {
    let isIn = false;
    if (value && this._allPages && this._allPages.length > 0) {
      for (let i = 0; i < this._allPages.length; i++) {
        if (value === this._allPages[i].value) {
          isIn = true;
          break;
        }
      }
    }
    return isIn;
  }

  _rebuildAllPages(list: any[]) {
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        item.value = item.id;
        item.label = item.label || item.dicItemAlias;
        const isIn = this._checkIsInOptions(item.value);
        if (!isIn) {
          this._allPages.push(item);
        }
        //                this._allPages[i].value = this._allPages[i].id;
        //                this._allPages[i].label = this._allPages[i].label || this._allPages[i].dicItemAlias;
      }
    }
  }

  _showRightChildrenData() {
    if (this._pagePathDatas && this._pagePathDatas.right && this._pagePathDatas.right.length > 0) {
      this._pagePathDatas.right[0].isShow = true;
      this._pagePathDatas.right[0].key = 'root';
      this._pagePathDatas.right[0].list = this._allPages;
      this._pagePathDatas.right[0].content = this._pagePathDatas.right[0].title;
    }
  }

  _showLeftData() {
    if (this._pagePathDatas && this._pagePathDatas.left && this._pagePathDatas.left.length > 0) {
      for (let i = 0; i < this._pagePathDatas.left.length; i++) {
        this._pagePathDatas.left[i].isShow = false;
        this._pagePathDatas.left[i].showArrow = false;
      }
    }
  }

  rendChildrenCom(data, tree, queryChild) {
    //      this._childrenLevel++;
    if (data && tree && tree.length > 0) {
      for (let i = 0; i < tree.length; i++) {
        if (data.id === tree[i].id) {
          if (queryChild) {
            //                      tree[i].isShow = true;
            tree[i].children = data.right;
          }
        } else {
          this.rendChildrenCom(data, tree[i].children, queryChild);
        }
      }
    }
  }

  rendPagePathCom(queryChild: boolean) {
    //        this._childrenLevel = 0;
    this._showRightChildrenData();
    this._showLeftData();
    this.rendChildrenCom(this._childrenData, this._pagePathDatas.right, queryChild);
    this._cmData = this._pagePathDatas;
    this.loopList(this._cmData.right);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter) {
      this._isQueriedData = false;
      this._pagePathFilter = changes.filter.currentValue;
      this._currentPage = 1;
      this._allPages = [];
      this._searchPageWord = '';
      this.queryAllPages(false, false);
    }
  }

  ngOnInit() {
    this.listenerWindownResize();
  }
}

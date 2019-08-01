import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import * as reducer from '../../ngrx/reducer';
import * as global from '../../ngrx/action/global';
import * as moment from 'moment';
import { numberPercent } from '../../utils/number-percent';

import { Router } from '@angular/router';
import { ConsumerPortraitSourceService } from '../../services/source/consumerPortrait.source.service';


@Component({
  selector: 'cusanalysis-container',
  templateUrl: './cusanalysis-container.component.html',
  styleUrls: ['./cusanalysis-container.component.less'],
  providers: [
    ConsumerPortraitSourceService,
  ],
})
export class CusAnalysisContainerComponent implements OnInit, OnDestroy {

  private _searchParam: string = ''; // 搜索字段
  private noTableResult: string = '加载中...'; // 表格无数据时展示字段
  private _tableData: any[] = []; // 表格数据
  private _currentPage: number = 1; // 当前页码
  private _pageSize: number = 10; // 每页条数
  private _total: number = 0; // 数据总数

  // 状态管理
  private _store: any;
  private _startTime: string = moment(new Date()).format('YYYY-MM-DD'); // 默认为当前时间
  private _endTime: string = moment(new Date()).format('YYYY-MM-DD'); // 默认为当前时间

  constructor(
    private router: Router,
    private store$: Store<reducer.State>,
    private consumerPortraitSourceService: ConsumerPortraitSourceService,
  ) {
    this._store = this.store$.select('global').debounceTime(1000).subscribe(result => {
      this._startTime = moment(new Date(result.startTime)).format('YYYY-MM-DD');
      this._endTime = moment(new Date(result.endTime)).format('YYYY-MM-DD');

      this.getTableList(true);
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._store.unsubscribe();
  }

  /**
   * 获取表格数据
   * @param flag [是否将页码设置为首页]
   */
  getTableList(flag?: boolean) {
    this._tableData = [];
    this.noTableResult = '加载中...';
    if (flag) {
      if (this._currentPage === 1) {
        this.getTable();
      } else {
        this._currentPage = 1;
      }
    } else {
      this.getTable();
    }
  }

  getTable() {
    const params = {
      startTime: this._startTime,
      endTime: this._endTime,
      searchParam: this._searchParam,
      currentPage: this._currentPage,
      pageSize: this._pageSize,
    };
    this.consumerPortraitSourceService.getConsumerPortraitList(params).then((res: any) => {
      if (res.code === 200) {
        const data = res.result;
        this._total = data.page.totalCount;
        if (data.page.totalCount === 0) {
          this.noTableResult = '暂无数据';
          return;
        }
        const stateObj = {
          10: {
            str: '完成构建',
            value: 100,
          },
          20: {
            str: '构建中',
            info: '预计1小时构建完成',
            value: 50,
          },
          30: {
            str: '构建失败',
            info: '请刷新，重新构建',
            value: 0,
          },
        };
        const list = data.resultData.map((x: any) => {
          const item = x;
          item.stateInfo = stateObj[x.state] || {
            str: '构建失败',
            info: '请刷新，重新构建',
            value: 0,
          };
          return item;
        });
        this._tableData = list;
      }
    })
  }

  /**
   * 搜索表格事件
   * @param string [搜索的内容]
   */
  onSearch(string: string) {
    this.getTableList(true);
  }
  onBlur() {
    if (this._searchParam === '') {
      this.getTableList(true);
    }
  }

  /**
   * 查看画像详情数据
   * @param info [画像信息]
   */
  toDetails(info: any) {
    this.router.navigate(['cus-analysis/cus-analysis-details', info.name], {
      queryParams: {
        id: info.id,
        type: '基本属性',
      },
    });
  }

  /**
   * 跳转创建和编辑页面
   * @param info [编辑的画像信息]
   */
  onOperation(info?: any) {
    if (info) {
      this.router.navigate(['cus-analysis/edit-cus-analysis', info.name], {
        queryParams: {
          id: info.id,
        },
      });
    } else {
      this.router.navigate(['cus-analysis/operation-cus-analysis']);
    }
  }

  /**
   * 刷新某个画像数据
   * @param info [刷新的画像信息]
   */
  onRefresh(info: any) {
    this._tableData.map((item: any) => {
      let copy = item;
      if (item.id === info.id) {
        copy.stateInfo = '刷新中...';
      }
      return copy;
    });
    this.consumerPortraitSourceService.getConsumerPortraitById(info.id).then((res: any) => {
      if (res.code === 200) {
        const data = res.result;
        const stateObj = {
          10: {
            str: '完成构建',
            value: 100,
          },
          20: {
            str: '构建中',
            info: '预计1小时构建完成',
            value: 50,
          },
          30: {
            str: '构建失败',
            info: '请刷新，重新构建',
            value: 0,
          },
        };
        data.stateInfo = stateObj[data.state] || {
          str: '构建失败',
          info: '请刷新，重新构建',
          value: 0,
        };
        const list = this._tableData.map((item: any) => {
          let copy = item;
          if (item.id === info.id) {
            copy = data;
          }
          return copy;
        });
        this._tableData = list;
      }
    })
  }
}

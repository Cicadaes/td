import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Store } from '@ngrx/store';
import * as reducer from '../../ngrx/reducer';
import * as secondLevel from '../../ngrx/action/secondLevel';
import * as global from '../../ngrx/action/global';
// import services
import { MediaExploreSourceService } from '../../services/source/mediaExplore.source.service'
@Component({
  selector: 'media-exploration',
  templateUrl: './media-exploration-container.component.html',
  styleUrls: ['./media-exploration-container.component.less'],
  providers: [
    MediaExploreSourceService,
  ]
})
export class MediaExplorationContainerComponent implements OnInit {
  private _dataSet: any = [];
  private _currentPage: any = 1;
  private _pageSize: any = 10;
  private _total: number;
  private parmas: any = {
    pageSize: this._pageSize,
    currentPage: this._currentPage,
  }
  private search: any;
  constructor(
    private mediaExploreSourceService: MediaExploreSourceService,
    private router: Router,
    private store$: Store<reducer.State>,
  ) {
    this.getMediaExploreList(this.parmas)
  }

  ngOnInit() {
  }
  getMediaExploreList(parmas: any) {
    this.mediaExploreSourceService.getMediaExploreList(parmas).then((data: any) => {
      if (data.code == 200 && data.result && data.result.resultData) {
        this._total = data.result.page.totalCount;
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
        const list = data.result.resultData.map((x: any) => {
          const item = x;
          item.stateInfo = stateObj[x.state];
          return item;
        });
        this._dataSet = list;

        this._dataSet.forEach((item: any) => {
          for (let i in item) {
            if (item[i] == null) {
              item[i] = '--'
            }
          }
        })
      }
    })
  }
  // 搜索
  onSearch(e: any) {
    this.parmas.keyword = e;
    this.PageIndexChange(1);
  }
  blur() {
    if (this.search === '') {
      this.parmas.keyword = '';
      this.PageIndexChange(1);
    }
  }
  //改变页码
  PageIndexChange(e: number) {
    if (this._currentPage === e) {
      this.parmas.currentPage = e;
      this.getMediaExploreList(this.parmas);
    } else {
      this._currentPage = e;
    }
  }
  // 改变每页数量
  PageSizeChange(e: any) {
    this.parmas.pageSize = this._pageSize;
    this.PageIndexChange(1);
  }
  // 新建
  create(name: any) {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: null,
    })
    this.router.navigate(['/media-exploration/create', name])
  }
  // 编辑
  edit(name: any, data: any) {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: data.id,
    })
    this.router.navigate(['/media-exploration/create', name, data.id])
  }
  // 刷新
  refresh(data: any) {
    this.mediaExploreSourceService.getOneMediaExplore(data.id).then((data: any) => {
      if (data.code == 200 && data.result) {
        const res = data.result;
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
        data.stateInfo = stateObj[data.state];
        const list = this._dataSet.map((item: any) => {
          let copy = item;
          if (item.id === data.id) {
            copy = data;
          }
          return copy;
        });
        this._dataSet = list;
      }
    })

  }
  //  下载
  download(data: any) {

  }

  // 查看详情 
  inDetail(data: any) {
    if (data !== null && data !== undefined) {
      this.store$.dispatch({
        type: global.SET_GLOBAL_MEDIA_EXPLORE_OPTION,
        mediaExploreId: data.id,
        mediaExploreName: data.name
      });
      localStorage.setItem('TD_BG_MEDIA_EXPLORE_OPTION', JSON.stringify({ 'value': data.id, 'label': data.name }))
      this.router.navigate(['/media-exploration/media-customer'])
    }
  }




















}

import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { CurdService } from '../../../curd.service';

@Injectable()
export class PagePathComService extends CurdService {
  //监听显示隐藏左侧
  private ShowLeft = new Subject<any>();

  missionShowLeft$ = this.ShowLeft.asObservable();

  showLeft(state: boolean) {
    this.ShowLeft.next(state);
  }

  //监听加载子集
  private LoadData = new Subject<any>();

  missionLoadData$ = this.LoadData.asObservable();

  loadData(id: any) {
    this.LoadData.next(id);
  }

  //监听切换根目录
  private SwitchRoot = new Subject<any>();

  missionSwitchRoot$ = this.SwitchRoot.asObservable();

  switchRoot(data: any) {
    this.SwitchRoot.next(data);
  }

  //监听加载更多数据
  private LoadMoreData = new Subject<any>();

  missionLoadMoreData$ = this.LoadMoreData.asObservable();

  loadMoreData(data: any) {
    this.LoadMoreData.next(data);
  }

  //监听搜索页面数据
  private OnSearchPageData = new Subject<any>();

  missionOnSearchPageData$ = this.OnSearchPageData.asObservable();

  onSearchPageData(data: any) {
    this.OnSearchPageData.next(data);
  }

  queryClickPapgePathData(params: any) {
    const url = `${this.reportBaseUrl}/pathAnalyze/clickPathAnalyzeList`;
    return this.http.post(url, params);
  }

  constructor(private injector: Injector) {
    super(injector);
  }
}

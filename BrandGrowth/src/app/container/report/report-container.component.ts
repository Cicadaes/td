import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
const _ = require('lodash');

import { Store } from '@ngrx/store';
import * as reducer from './../../ngrx/reducer';

// import Services
import { ReportSourceService } from './../../services/source/report.source.service';


@Component({
  selector: 'report-container',
  templateUrl: './report-container.component.html',
  styleUrls: ['./report-container.component.less'],
  providers: [ReportSourceService]
})
export class ReportContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  // table内容
  columns = [
    {
      title: '',
      key: '',
      width: '2%'
    },
    {
      title: '报告ID',
      key: 'reportId',
      width: '20%',
    },
    {
      title: '报告名称',
      key: 'reportName',
      width: '20%',
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: '20%',
    },
    {
      title: '状态',
      key: 'state',
      width: '10%',
      html: true
    },
    {
      title: '',
      key: '',
      width: '10%'
    },
    {
      title: '操作',
      key: 'handle',
      width: '10%',
      html: true
    },
    {
      title: '',
      key: '',
      width: '7%'
    },
  ];

  data: any[] = [];              // 表格内容
  pageSize: number = 10;         // 表格一页显示的行数
  currentPage: number = 1;       // 当前表格的页码
  totalCount: number = 0;        // 总数

  startTime: any; // 全局的开始时间
  endTime: any;   // 全局的结束时间

  // 营销活动列表
  marketingReportList: any = []; // 营销报告列表
  searchValue: string = '';      // 搜索内容

  subscription: Subscription; // 用来取消订阅

  @ViewChild('progress') progressRef: TemplateRef<any>;
  @ViewChild('progress', { read: ViewContainerRef }) progressVcRef: ViewContainerRef;

  @ViewChild('search', { read: ElementRef }) searchEL: ElementRef;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private store$: Store<reducer.State>,
    private reportSourceService: ReportSourceService
  ) { }

  ngOnInit() {
    this.subscription = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe((data: any) => {
      this.startTime = data.startTime;
      this.endTime = data.endTime;
      // 整理营销报告列表的内容
      this.parseMarketingReportList();
    })
  }
  
  ngAfterViewInit(): void {
    // 监听search控件，取0.5s内最新的值去查询
    Observable.fromEvent(this.searchEL.nativeElement, 'input').debounceTime(500).subscribe((event: any) => {
      this.parseMarketingReportList(event.target.value);
    });
  }

  /**
   * 根据ng-template创建对应元素
   * @param el 模版引用名
   * @param context 上下文
   * @return 返回一个div元素
   */
  generateElementOperation(el: any, context: any): Element {
    // 创建一个新标签
    let divTag = this.renderer.createElement('div');
    // 创建内嵌视图
    let embeddedView = this[`${el}VcRef`].createEmbeddedView(this[`${el}Ref`], context);
    // 动态添加子节点
    embeddedView.rootNodes.forEach((node: any) => {
      this.renderer.appendChild(divTag, node);
    });

    return divTag;
  }

  /** 
   * 创建表格的操作项
   * @param id 表格当前行id
   * @return 返回一个div元素
   */
  generateOperatorOperation(id: any, item?: any): Element {
    let divTag = this.renderer.createElement('div'); // 创建一个div元素

    // 创建一个编辑，下载和删除的a标签
    // 编辑
    let editTag = this.renderer.createElement('a');  
    this.renderer.appendChild(editTag, this.renderer.createText('编辑')); 
    this.renderer.listen(editTag, 'click', () => {
      this.navigateEditPage(item);
    });
    // 下载
    let downTag = this.renderer.createElement('a');
    this.renderer.appendChild(downTag, this.renderer.createText('下载'));
    // 删除
    let delTag = this.renderer.createElement('a');
    this.renderer.appendChild(delTag, this.renderer.createText('删除'));
    this.renderer.listen(delTag, 'click', () => {
      this.deleteMarketReportById(id);
    });

    // 将它们添加到div元素里
    this.renderer.appendChild(divTag, editTag);
    this.renderer.appendChild(divTag, downTag);
    this.renderer.appendChild(divTag, delTag);

    // 在div元素上设置弹性盒模型
    this.renderer.setAttribute(divTag, 'style', 'display:flex;justify-content:space-between;');
    
    return divTag;
  }

  /**
   * 获取营销报告列表
   * @param 参数
   * @return Observable对象，抛出营销报告列表
   */
  getMarketingReportList(params: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.reportSourceService.getMarketReportList(params).then((data: any) => {
        if (data.code === 200 && data.result) {
          observer.next(data.result);
        }
      })
    })
  }

  /**
   * 整理营销报告列表
   */
  parseMarketingReportList(searchValue?: string): void {
    let params = {
      startTime: moment(this.startTime).format('YYYY-MM-DD'),
      endTime: moment(this.endTime).format('YYYY-MM-DD'),
      currentPage: this.currentPage,
      pageSize: this.pageSize
    };
    if (searchValue) params['searchParam'] = searchValue;
    this.getMarketingReportList(params).subscribe((list: any) => {
      this.pageSize = list.page.pageSize;
      this.currentPage = list.page.currentPage;
      this.totalCount = list.page.totalCount;
      this.marketingReportList = list.resultData;
      this.data = [];  
      let arrTemp: any[] = [];
      list.resultData.map((item: any) => {     // 循环遍历将表格需要的内容push进数组
        arrTemp.push({
          reportId: item.reportId,            
          reportName: item.reportName,
          createTime: moment(item.createTime).format('YYYY-MM-DD'),
          state: this.generateElementOperation('progress', { state: this.getProcessFromState(item.state) }),
          handle: this.generateOperatorOperation(item.id, item),
        })
      })
      this.data = _.cloneDeep(arrTemp);
    });
  }

  /**
   * 获取状态对应的百分比
   * @param state 1, 2, 3, 4, 5
   */
  getProcessFromState(state: any): number {
    switch(state) {
      case 1: return 20;
      case 2: return 40;
      case 3: return 60;
      case 4: return 80;
      case 5: return 100;
      default: return 20;
    }
  }

  /**
   * 跳转到新建人群页面
   * @param {*} name 
   */
  create(name: any) {
    this.router.navigate(['/report/create/select-type', name]);
  }

  navigateEditPage(item: any) {
    this.router.navigate(['/report/edit/select-type', item.reportName, item.id, { 
      exportName: item.reportName,
      startTime: item.startTime,
      endTime: item.endTime,
      monitorLinks: item.monitorLinks,
      metric: item.metric,
      reportType: item.reportType,
      timeDimension: item.timeDimension,
      peopleDimension: item.peopleDimension,
      deviceDimension: item.deviceDimension,
      regionDimension: item.regionDimension
    }]);
  }

  /**
   * 删除指定id的营销报告
   * @param id 营销报告id
   */
  deleteMarketReportById(id: any): void {
    this.reportSourceService.deleteMarketReportById(id).then((data: any) => {
      if (data && data.code == 200) {
        this.currentPage = 1;
        this.parseMarketingReportList();
      }
    })
  }

  /**
   * 当pageSize改变的时候刷新列表内容
   * @param size 每页显示最大行数
   */
  pageSizeChange(size: any): void {
    if (size !== this.pageSize) {
      this.pageSize = size;
      this.parseMarketingReportList();
    }
  }

  /**
   * 当当前页码改变的时候触发，刷新列表内容
   * @param index 
   */
  pageIndexChange(index: any): void {
    if(index !== this.currentPage) {
      this.currentPage = index;
      this.parseMarketingReportList();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

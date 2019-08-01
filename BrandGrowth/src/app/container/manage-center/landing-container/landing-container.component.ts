import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';
import * as reducer from '../../../ngrx/reducer';
import * as secondLevel from '../../../ngrx/action/secondLevel';
import { Store } from '@ngrx/store';
import { CmMessageService } from 'ng-cosmos-td-ui';
// import Services
import { ActpageSourceService } from '../../../services/source/actpage.source.service'
import { PeoplegroupSourceService } from '../../../services/source/peoplegroup.source.service';
@Component({
  selector: 'landing-container',
  templateUrl: './landing-container.component.html',
  styleUrls: ['./landing-container.component.less'],
  providers: [
    PeoplegroupSourceService,
    AsyncPipe,
    ActpageSourceService,
  ]
})
export class LandingContainerComponent implements OnInit, OnDestroy {
  // table内容
  columns = [
    {
      title: '着陆页名称',
      key: 'name',
    },
    {
      title: 'siteID',
      key: 'key',
    },
    {
      title: '着陆页地址',
      key: 'crowdAttr',
    },
    {
      title: '登陆时间',
      key: 'time',
    },
    {
      title: '操作',
      key: 'handle',
      html: true
    },
  ];

  data: any[] = []; // 表格内容
  _store: any;
  // 授权账户列表
  crowdList: any = [];
  searchValue: string = '';  // 搜索内容
  displayData: any = [];     // 包含checked字段的授权账户列表，最多10个

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private store$: Store<reducer.State>,
    private asyncPipe: AsyncPipe,
    private peoplegroupSourceService: PeoplegroupSourceService,
    private actpageSourceService: ActpageSourceService,
    private cmMessage: CmMessageService,
  ) { }

  ngOnInit() {
    this._store = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe((data: any) => {
      // 获取着陆页列表
      this.actpageSourceService.getActpageList().then((data: any) => {
        if (data.code == 200 && data.result) {
          this.crowdList = data.result;
          this.data = [];
          data.result.map((item: any) => {
            this.data.push({
              id: item.id,
              name: item.name,
              crowdAttr: item.link,
              time: item.optime,
              key: item.key ? item.key : "",
              handle: this.generateEditOperation(['/manage-center/landing/create-landing', item.name, item.id]),
            })
          })
        }
      })
    })
  }

  /**
  * 生成一个a标签，可以通过路由跳到编辑页
  * @param urls 地址
  */
  generateEditOperation(urls: any[]) {
    let aTag = this.renderer.createElement('a');  // 创建一个新标签
    this.renderer.listen(aTag, 'click', () => {   // 监听click事件，导航到传入地址的页面
      this.router.navigate(urls);
    });
    let value = this.renderer.createText('编辑'); // 创建text
    this.renderer.appendChild(aTag, value);      // 将text放入a标签
    return aTag;
  }

  /**
   * 删除已选择的授权账户
   */
  deleteCrowd(): void {
    let a;
    this.displayData.map((item: any) => {
      if (item.checked) {
        a = this.actpageSourceService.deleteActpage(item.id).then(res => {
          this.data = this.data.filter((old: any) => {
            return old.id !== item.id;
          })

        });

      }
    });
    Promise.all([a]).then(reuslt => {
      this.cmMessage.success('删除成功!')
    })

  }

  /**
   * 当列表被选的时候，获取列表
   * @param list list
   */
  getDisplayData(list: any) {
    this.displayData = list;
  }

  // 新建人群
  create(name: any) {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: null,
    })
    this.router.navigate(['/manage-center/landing/create-landing', name])
  }
  ngOnDestroy(): void {
    // 取消对Observable的订阅，保证性能
    this._store.unsubscribe();
  }

}

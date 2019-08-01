import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';

import { Store } from '@ngrx/store';
import * as reducer from './../../../ngrx/reducer';

// import Services
import { AuthSourceService } from '../../../services/source/auth.source.service';

@Component({
  selector: 'auth-container',
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.less'],
  providers: [AuthSourceService, AsyncPipe]
})
export class AuthContainerComponent implements OnInit, OnDestroy {
  // 表格相关内容
  columns = [ // 表头相关信息
    {
      title: '邮箱',
      key: 'email',
      width: '20%', 
    },
    {
      title: '角色',
      key: 'character',
      width: '20%', 
    },
    {
      title: '创建时间',
      key: 'creatTime',
      width: '20%', 
    },
    {
      title: '最后登录时间',
      key: 'lastLoginTime',
      width: '20%', 
    },
    {
      title: '操作',
      key: 'handle',
      width: '20%',
      html: true
    },
  ];
  data: any[] = []; // 表格内容

  // 授权账户列表
  authAccountList: any = []; // 授权账户列表
  userEmail: string = '';    // 当前用户的email，只要不想等的，就认为是授权账户
  displayData: any = [];     // 包含checked字段的授权账户列表，最多10个
  searchValue: string = '';  // 搜索内容

  // 订阅实例
  subscription: any = null;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private store$: Store<reducer.State>,
    private asyncPipe: AsyncPipe,
    private authSourceService: AuthSourceService
  ) { }

  ngOnInit(): void {
    this.subscription = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe((data: any) => {
      // 获取授权记录列表
      this.getAuthAccountList().subscribe((list: any) => {
        this.authAccountList = list;
        this.data = [];               // 清空原来的表格内容，防止污染
        list.map((item: any) => {     // 循环遍历将表格需要的内容push进数组
          this.data.push({
            id: item.id,            
            email: item.licensee,
            character: data.email === item.licensee ? "创建者" : "授权用户",
            creatTime: item.optime,
            // creatTime: item.optime ? moment(item.optime).format('YYYY.MM.DD') : null,
            lastLoginTime: item.loginTime,
            // lastLoginTime: item.loginTime ? moment(item.loginTime).format('YYYY.MM.DD') : null,
            handle: this.generateEditOperation(['/manage-center/auth/create', item.licensee, item.author]),
          })
        })
      });
    })
  }

  /**
   * 获取授权账户列表
   */
  getAuthAccountList(): Observable<any> {
    return Observable.create((observer: any) => {
      this.authSourceService.getAuthAccoutList().then((data: any) => {
        if(data.code === 200 && data.result) {
          observer.next(data.result);
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
   * 当列表被选的时候，获取列表
   * @param list list
   */
  getDisplayData(list: any) {
    this.displayData = list;
  }

  /**
   * 删除已选择的授权账户
   */
  deleteCheckedAccount(): void {
    this.displayData.map((item: any) => {
      if (item.checked) {
        this.authSourceService.deleteAuthAccount(item.id);
        this.data = this.data.filter((old: any) => {
          return old.id !== item.id;
        })
      }
    });
  }

  /**
   * 跳转到新建授权账户的页面
   */
  toCreateAuth(): void {
    this.router.navigate(['/manage-center/auth/create', '新建授权账户']);
  }

  ngOnDestroy(): void {
    // 取消对Observable的订阅，保证性能
    this.subscription.unsubscribe();
  }
}

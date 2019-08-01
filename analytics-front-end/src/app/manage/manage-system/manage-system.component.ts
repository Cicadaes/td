import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { BaseComponent } from '../../common/base-component';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-manage-system',
  templateUrl: './manage-system.component.html',
  styleUrls: ['./manage-system.component.less']
})
export class ManageSystemComponent extends BaseComponent implements OnInit, OnChanges {
  tabList: any = [
    {
      url: '/manage/manage-system/event-mgt',
      name: '事件管理'
    },
    {
      url: '/manage/manage-system/event-attribute',
      name: '埋点事件属性管理'
    },
    {
      url: '/manage/manage-system/user-attribute',
      name: '用户属性管理'
    },
    // 5.1.1隐藏  start
    // {
    //   url: '/manage/manage-system/source-mgt',
    //   name: '来源管理'
    // },
    // {
    //   url: '/manage/manage-system/activity-mgt',
    //   name: '活动管理'
    // },
    // 5.1.1隐藏  end
    {
      url: '/manage/manage-system/page-mgt',
      name: '页面管理'
    },
    {
      url: '/manage/manage-system/user-click-map',
      name: '页面点击图管理'
    },
    {
      url: '/manage/manage-system/app-info',
      name: '应用信息'
    },
    {
      url: '/manage/manage-system/channel-mgt',
      name: '渠道管理'
    },
    {
      url: '/manage/manage-system/param-mgt',
      name: '页面参数管理'
    }
  ];

  _containerStyle = {
    height: '',
    overflow: 'auto'
  };

  isAutoMNP: boolean = false;

  constructor(private injector: Injector) {
    super(injector);
    this.initRouterList('系统管理');

    this.listenerWindownResize();

    const that = this;
    const list = window.localStorage.getItem('transfer') && JSON.parse(localStorage.getItem('transfer'));
    if (list) {
      const length = list.length;
      for (let i = 0; i < length; i++) {
        if (list[i]['code'] === 'miniprogram') {
          that.isAutoMNP = true;

          // 在 7 的位置加入一条
          if (that.tabList[7] && that.tabList[7].url === '/manage/manage-system/qrcode') {
            break;
          } else {
            const obj = that.tabList[7];
            that.tabList[7] = {
              url: '/manage/manage-system/qrcode',
              name: '小程序二维码管理',
              show: false
            };
            that.tabList.push(obj);
            break;
          }
        }
      }
    }
  }

  calContainerStyle(): void {
    setTimeout(() => {
      const maxHeight = window.innerHeight - 110;
      this._containerStyle = {
        height: maxHeight.toString() + 'px',
        overflow: 'auto'
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

  ngOnInit() {}
}

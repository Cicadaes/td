import {
  Component,
  OnInit,
  Type,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiCommonComponent } from './api-common.component';
import { BusinessDetailsContainerComponent } from './business-details-container/business-details-container.component';
import { DeviceDetailsContainerComponent } from './device-details-container/device-details-container.component';
import { BaseDetailsContainerComponent } from './base-details-container/base-details-container.component';
// service
import { ConsumerPortraitSourceService } from '../../../services/source/consumerPortrait.source.service';


@Component({
  selector: 'cusanalysis-details-container',
  templateUrl: './cusanalysis-details-container.component.html',
  styleUrls: ['./cusanalysis-details-container.component.less'],
  providers: [
    ConsumerPortraitSourceService,
  ],
})
export class CusanalysisDetailsContainerComponent implements OnInit {

  @ViewChild('detailsMove', { read: ViewContainerRef }) detailsMove: ViewContainerRef;

  private selectedIndex: number = 0;
  private tabList: any[] = [
    {
      name: '基本属性',
      component: this.createComponent(BaseDetailsContainerComponent),
    },
    /* {
      name: '设备属性',
      component: this.createComponent(DeviceDetailsContainerComponent),
    }, */
    {
      name: '电商团购',
      component: this.createComponent(BusinessDetailsContainerComponent),
    },
  ];
  private urlInfo: any = { // url参数
    id: '',
    name: '',
    type: '基本属性',
  };

  private metricData: any = []; // 客群目标受众列表
  private isCheckMetric: number = 0; // 当前选择的指标索引

  private cusSelectList: any[] = []; // 客群画像列表

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ConsumerPortrait: ConsumerPortraitSourceService,
  ) {
    // 获取URL信息
    const id = activatedRoute.snapshot.queryParams.id || '';
    const type = activatedRoute.snapshot.queryParams.type || '基本属性';
    const name = activatedRoute.snapshot.params.name || '';
    // 存储URL信息
    this.urlInfo.id = Number(id);
    this.urlInfo.type = type;
    this.urlInfo.name = name;
    // tab切换
    this.tabList.forEach((x: any, i: number) => {
      if (x.name === type) {
        this.selectedIndex = i;
      }
    });

    this.ConsumerPortrait.getConsumerAllList().then((res: any) => {
      if (res.code === 200) {
        const data = res.result;
        const list = data.map((x: any) => {
          return {
            value: x.id,
            label: x.name,
          };
        });
        this.cusSelectList = list;
      }
    });
  }

  ngOnInit() {
    const id = this.urlInfo.id;
    if (id === '') {
      this.router.navigate(['cus-analysis']);
    } else {
      this.setTabContent(this.tabList[this.selectedIndex]);
    }
  }

  /**
   * 获取当前活动详情数据
   * @param id [当前活动ID]
   */
  private saveData: any = ''; // 当前客群的详情数据
  getAnalysisById(id: any) {
    let fn = 'getConsumerBaseDetails';
    switch (this.urlInfo.type) {
      case '基本属性':
        fn = 'getConsumerBaseDetails';
        break;
      case '电商团购':
        fn = 'getConsumerBusinessDetails';
        break;
      default:
        break;
    };

    this.ConsumerPortrait[fn](id).then((res: any) => {
      if (res.code === 200) {
        const data = res.result;
        this.saveData = data;
        const metricData = JSON.parse(data).map((item: any) => {
          const a = item.audienceIndex;
          return {
            info: a.name,
            content: `${a.percent}%`,
          };
        });
        this.metricData = metricData;
        // this.onMetricClick(0);
      }
    });
  }

  onMetricClick(info: any) {
    const data = !!this.saveData ? JSON.parse(this.saveData)[info] : null;
    this.componentMove.instance['resetMove'](data);
  }

  createComponent(move: any) {
    class addComponent {
      constructor(public component: Type<any>) { }
    }
    return new addComponent(move);
  }

  /**
   * 选择的tab项设置内容
   * @param info [当前选择的tab项信息]
   */
  private componentMove: any = null;
  setTabContent(info: any) {
    if (info.name !== this.urlInfo.type) {
      this.urlInfo.type = info.name;
      this.router.navigate(['cus-analysis/cus-analysis-details', this.urlInfo.name], {
        queryParams: {
          id: this.urlInfo.id,
          type: info.name,
        },
      });
    }

    const move = info.component;
    if (!!move && move.component && this.detailsMove) {
      this.detailsMove.clear();
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(move.component);
      const ref = this.detailsMove.createComponent(componentFactory);
      this.componentMove = ref;
      this.getAnalysisById(this.urlInfo.id);
    }
  }

  onSelectChange(info: any) {
    const data = this.cusSelectList.filter(x => (x.value === info))[0];
    this.urlInfo.name = data.label;
    this.router.navigate(['cus-analysis/cus-analysis-details', data.label], {
      queryParams: {
        id: data.value,
        type: this.urlInfo.type,
      },
    });
    this.getAnalysisById(this.urlInfo.id);
  }
}

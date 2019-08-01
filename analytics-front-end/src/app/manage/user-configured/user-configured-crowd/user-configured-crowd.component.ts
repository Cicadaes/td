import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { UserConfiguredService } from '../user-configured.service';
import { saveMessage } from '../../../utils/post-message';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { BaseComponent } from '../../../common/base-component';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-user-configured-crowd',
  templateUrl: './user-configured-crowd.component.html',
  styleUrls: ['./user-configured-crowd.component.less']
})
export class UserConfiguredCrowdComponent extends BaseComponent implements OnInit, OnChanges {
  tabList: any = [
    {
      url: '/manage/user-configured/crowd',
      name: '用户分群配置'
    },
    {
      url: '/manage/user-configured/insight',
      name: '用户洞察配置'
    },
    {
      url: '/manage/user-configured/tag',
      name: '自定义标签管理'
    }
  ];

  containerStyle: any; // 根据页面高度渲染左边的菜单
  leftMuneList: any = []; // 左侧菜单列表
  attributeData: any = []; // 属性组列表
  attributeDataChoose: any = [];
  allAttributeData: any = []; // 全部属性组列表
  checkedAttributeData: any = {}; // 选择的属性组列表
  index2: any = 0; // 人群画像配置和常规配置tab切换
  attrIndex: any; // 各种属性配置
  attrName: any; // 各种属性配置名称
  attrLoadingFlag = true; // 属性配置TableLoading
  editFlag = false; // 编辑flag
  portrayalData: any = []; // 人群画像配置Table数据
  portrayalFlag = false; // 人群画像弹框 false: 新建  true: 编辑
  configuredObj: any;
  messageData: any; // 配置报表 参数
  itemObj: any; // 删除人群画像组的相关信息
  count: any = 0; // 可选择的属性个数
  /* 人群画像配置相关参数 */
  isVisible = false;
  editData: any; // 编辑人群画像数据
  portrayalTableLoading = true; // 人群画像组TableLoading
  // 分页数据
  _current = 1; // 当前页
  _pageSize = 10; // 每页条数
  _total = 1; // 数据总量
  parmas: any = {}; // 查询人群画像组列表参数
  removeFlag = false; // 删除弹框
  _item: any; // 待删除的某条数据
  pageSizeOptions: any[] = TABLE_PAGE_SIZE_OPTIONS; // Table页数选择器可选值

  reportUrl: any; // 报表配置url

  checkObj: any = {};

  constructor(
    private userConfiguredService: UserConfiguredService,
    private injector: Injector,
    private appService: AppService
  ) {
    super(injector);
    this.initRouterList('用户配置');
  }

  ngOnInit() {
    this.reportUrl = localStorage.getItem('user_manage_report_url');

    this.messageData = localStorage.getItem('dmp') && JSON.parse(localStorage.getItem('dmp')).dmp;
    if (this.messageData) {
      this.messageData.header.map((item: any) => {
        if (this.messageData.target && item.name === this.messageData.target.name) {
          this.index2 = item.type;
        }
      });
    }

    this.parmas.productId = this.productId;

    this.attrIndex = 4;
    this.count = 5;
    this.attrName = '人群显著标签配置';
    // this.index2 = this.route.snapshot.params['tab2'] || 0;
    this.leftMuneList = [
      // {
      //     name: '组合分群配置',
      //     type: 1,
      //     source: 1,
      //     productId: this.productId
      // },
      // {
      //     name: 'Lookalike配置',
      //     type: 2,
      //     source: 1,
      //     productId: this.productId
      // },
      // {
      //     name: '特征聚类配置',
      //     type: 3,
      //     source: 1,
      //     productId: this.productId
      // },
      {
        name: '人群显著标签配置',
        type: 4,
        source: 1,
        productId: this.productId
      },
      {
        name: '人群导出配置',
        type: 5,
        source: 1,
        productId: this.productId
      }
    ];
    this.configuredObj = {
      source: 1,
      type: this.attrIndex,
      productId: this.productId,
      name: this.attrName
    };

    this.calContainerStyle();
    this.listenerWindownResize();
    this.getCheckedArrtibute(this.leftMuneList[0]);
    this.getAllArrtibute();
    this.getAttributeCount();
    this.parmas = {
      page: 1,
      rows: 10,
      productId: this.productId
    };
    this.getPortrait(this.parmas);
  }

  listenerWindownResize() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(event => {
        this.calContainerStyle();
      });
  }

  calContainerStyle(): void {
    this.containerStyle = {
      height: window.innerHeight - 85 - 32 - 47 + 'px'
    };
  }

  edtiData() {
    this.editFlag = true;
  }

  cancelEtim() {
    this.editFlag = false;
    this.composingData();
    // this.getAllArrtibute();
    // this.getCheckedArrtibute(this.configuredObj);
  }

  saveEtim() {
    this.editFlag = false;
    this.getCheckedArrtibute(this.configuredObj);
  }

  checkOne(item: any) {
    this.attrLoadingFlag = true;
    this.configuredObj.source = item.source;
    this.configuredObj.name = item.name;
    this.configuredObj.type = item.type;
    this.attrIndex = item.type;
    this.editFlag = false;
    this.attributeData = [];
    this.getAllArrtibute();
    if (item.type === 4) {
      if (!this.count) {
        this.count = 5;
      }
      // this.getAttributeCount();
    }

    if (this.checkObj.hasOwnProperty(item.type)) {
      this.checkedAttributeData = this.checkObj[item.type];
      setTimeout(() => {
        this.attrLoadingFlag = false;
      }, 500);
      return;
    }
    this.getCheckedArrtibute(item);
  }

  // 查询选中的属性
  getCheckedArrtibute(item: any) {
    const that = this;
    const obj = {
      type: item.type,
      source: item.source,
      productId: this.productId
    };

    this.checkedAttributeData = {};
    this.composingData();
    this.attrLoadingFlag = true;
    this.userConfiguredService.getCheckedArrtibute(obj).subscribe((response: any) => {
      if (obj.type === that.attrIndex) {
        response.data.map((one: any) => {
          one['checked'] = false;
          this.checkedAttributeData[one.attributeId] = 1;
        });
        this.checkObj[obj.type] = this.checkedAttributeData;
        this.composingData();
        this.attrLoadingFlag = false;
      }
    });
  }

  // 查询全部的属性
  getAllArrtibute() {
    this.userConfiguredService.getAllArrtibute().subscribe((response: any) => {
      this.allAttributeData = [];
      this.allAttributeData = response.data;
      this.allAttributeData.map((item: any) => {
        item.checked = false;
      });
      if (this.attrIndex === 4) {
        this.allAttributeData = this.allAttributeData.filter((item: any) => {
          return item.displayType === 'Tag';
        });
      }
      this.composingData();
    });
  }

  // 查询属性个数  人群显著标签配置
  getAttributeCount() {
    this.userConfiguredService.getAttributeCount({ key: 'CROW_SIGNIFICANCE' }).subscribe((response: any) => {
      this.count = Number(response.data);
    });
  }

  // 组装数据
  composingData() {
    const attributeList = [];
    this.attributeData = [];
    this.attributeDataChoose = [];

    // 合并已选择数据，并初始化已选择数据列表
    for (let i = 0; i < this.allAttributeData.length; i++) {
      if (this.checkedAttributeData[this.allAttributeData[i].id]) {
        this.allAttributeData[i]['checked'] = true;
        attributeList.push(this.allAttributeData[i]);
      } else {
        this.allAttributeData[i]['checked'] = false;
      }
    }

    // 分组完整的列表，供edit使用
    const cities = {};
    for (let z = 0; z < this.allAttributeData.length; z++) {
      if (cities[this.allAttributeData[z].groupName]) {
        cities[this.allAttributeData[z].groupName].push(this.allAttributeData[z]);
      } else {
        cities[this.allAttributeData[z].groupName] = [this.allAttributeData[z]];
      }
    }

    for (const key in cities) {
      if (cities.hasOwnProperty(key)) {
        this.attributeData.push({
          name: key,
          attributeLabel: cities[key]
        });
      }
    }

    // 分组已选择的列表，供detail使用
    const cities2 = {};
    for (let z = 0; z < attributeList.length; z++) {
      if (cities2[attributeList[z].groupName]) {
        cities2[attributeList[z].groupName].push(attributeList[z]);
      } else {
        cities2[attributeList[z].groupName] = [attributeList[z]];
      }
    }

    for (const key in cities2) {
      if (cities2.hasOwnProperty(key)) {
        this.attributeDataChoose.push({
          name: key,
          attributeLabel: cities2[key]
        });
      }
    }
  }

  /* 画像配置相关 */
  getPortrait(value: any) {
    this.userConfiguredService.getPortrait(value).subscribe((response: any) => {
      this.portrayalTableLoading = false;
      this.portrayalData = response.data.rows;
      this._total = response.data.total;
    });
  }

  // 改变页码
  PageIndexChange(e: number) {
    this.portrayalData = [];
    if (this._current === e) {
      this.parmas.page = e;
      this.portrayalTableLoading = true;
      this.getPortrait(this.parmas);
    } else {
      this._current = e;
    }
  }

  // 改变每页数量
  PageSizeChange(e: any) {
    this.portrayalTableLoading = true;
    this.parmas.rows = this._pageSize;
    this.PageIndexChange(1);
  }

  // 删除人群画像组
  deletePortrayal(item: any) {
    this._item = item;
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: `确定要删除画像组"${this._item['name']}"？`,
      nzOnOk: () => {
        this.deleteFunc();
      }
    });
  }

  deleteFunc() {
    this.portrayalTableLoading = true;
    this.userConfiguredService
      .daletePortrait(this._item.id, this._item.reportId, this._item.productId)
      .subscribe((response: any) => {
        const total = this._total;
        if (total % this.parmas.rows === 1 && this.parmas.page !== 1) {
          if (Math.ceil(total / this.parmas.rows) === this.parmas.page) {
            this.parmas.page = this.parmas.page - 1;
            this._current = this.parmas.page;
          }
        }
        this.getPortrait(this.parmas);
      });
  }

  // 确定删除 todo -del
  confirmHideDialog(type: any) {
    this.removeFlag = type;
    this.deleteFunc();
  }

  // 取消删除
  hideItemDialog(type: any) {
    this.removeFlag = type;
  }

  saveDate() {
    this.portrayalTableLoading = true;
    this.getPortrait(this.parmas);
  }

  // 显示新建弹框
  showModal(value: any, data?: any) {
    this.portrayalFlag = value;
    this.editData = data;
    this.isVisible = true;
  }

  // 隐藏新建弹框
  hideDialog(type: any) {
    this.isVisible = type;
  }

  configReport(item: any) {
    const aepUrl = window.location.origin + `/aeplus/#/manage/user-configured`;
    //const aepUrl0 = window.location.origin + `/aeplus/#/manage/user-configured/insight`;
    const aepUrl0 = window.location.origin + `/aeplus/#/manage/user-configured/crowd;tab2=0`;
    const aepUrl1 = window.location.origin + `/aeplus/#/manage/user-configured/crowd;tab2=1`;
    const obj = {
      dmp: {
        url: aepUrl,
        header: [
          { name: '用户配置', url: aepUrl0, type: 0 },
          { name: '用户分群配置', url: aepUrl0, type: 0 },
          { name: '人群画像配置', url: aepUrl1, type: 1 },
          { name: item.name, url: '' }
        ],
        reportId: item['reportId']
      },
      cache: true
    };
    saveMessage({
      data: { dmp: obj }
    });

    const src = this.reportUrl + `/studio/#/studio/${item.reportId}`;
    const token = localStorage.getItem('token');
    const product_id = localStorage.getItem('productId');
    let urlPart1 = '&components=0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0',
      urlPart2 = '&isShowPubStatus=0&isShowPages=0&isShowSaveTpl=0&isShowUnit=0&isFilterType=0';
    let param = `?product_id=${product_id}&token=${token}&custom=1${urlPart1}${urlPart2}`;
    this.appService.routerChangeMission({
      url: src + param,
      menuUrl: aepUrl,
      isIframe: true,
      newRouter: 'user-configured/studio'
    });
  }

  indexChange($event) {
    localStorage.removeItem('dmp');
  }
}

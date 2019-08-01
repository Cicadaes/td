import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { UserConfiguredService } from '../user-configured.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-user-configured-insight',
  templateUrl: './user-configured-insight.component.html',
  styleUrls: ['./user-configured-insight.component.less']
})
export class UserConfiguredInsightComponent extends BaseComponent implements OnInit, OnChanges {
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

  leftMuneList: any = []; // 左侧菜单列表
  containerStyle: any; // 根据页面高度渲染左边的菜单
  attributeData: any = []; // 属性组列表
  attributeDataChoose: any = [];
  allAttributeData: any = []; // 全部属性组列表
  checkedAttributeData: any = {}; // 选择的属性组列表
  attrIndex: any; // 各种属性配置
  attrName: any; // 各种属性配置名称
  attrLoadingFlag = true; // 属性配置TableLoading
  editFlag = false;
  configuredObj: any;
  checkObj: any = {};

  constructor(private userConfiguredService: UserConfiguredService, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.attrIndex = 6;
    this.attrName = '基础属性配置';
    this.leftMuneList = [
      {
        name: '基础属性配置',
        type: 6,
        source: 2,
        productId: this.productId
      },
      // {
      //     name: '用户列表搜索配置',
      //     type: 7,
      //     source: 2,
      //     productId: this.productId
      // },
      // {
      //     name: '用户列表快速搜索配置',
      //     type: 8,
      //     source: 2,
      //     productId: this.productId
      // },
      {
        name: '用户列表搜索结果配置',
        type: 9,
        source: 2,
        productId: this.productId
      }
    ];

    this.configuredObj = {
      source: 2,
      type: this.attrIndex,
      productId: this.productId,
      name: this.attrName
    };

    this.calContainerStyle();
    this.getCheckedArrtibute(this.leftMuneList[0]);
    this.getAllArrtibute();
  }

  calContainerStyle(): void {
    this.containerStyle = {
      height: window.innerHeight - 85 - 32 - 49 + 'px'
    };
  }

  /**
   * 当选中配置项时，获取配置项
   * @param item item
   */
  checkOne(item: any) {
    this.attrLoadingFlag = true;
    this.configuredObj.source = item.source;
    this.configuredObj.name = item.name;
    this.configuredObj.type = item.type;
    this.attrIndex = item.type;
    this.editFlag = false;
    this.attributeData = [];
    this.getAllArrtibute();

    // this.allAttributeData.map((one: any) => {
    //     one['checked'] = false;
    // });

    if (this.checkObj.hasOwnProperty(item.type)) {
      this.checkedAttributeData = this.checkObj[item.type];
      this.composingData();
      setTimeout(() => {
        this.attrLoadingFlag = false;
      }, 500);
      return;
    }
    this.getCheckedArrtibute(item);
  }

  edtiData() {
    this.editFlag = true;
  }

  cancelEtim() {
    this.editFlag = false;
    this.composingData();
    // this.getCheckedArrtibute(this.configuredObj);
    // this.getAllArrtibute();
  }

  saveEtim() {
    this.editFlag = false;
    this.getCheckedArrtibute(this.configuredObj);
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
      this.composingData();
    });
  }

  // 组装数据
  composingData() {
    const attributeList = [];
    this.attributeData = [];
    this.attributeDataChoose = [];

    for (let i = 0; i < this.allAttributeData.length; i++) {
      if (this.checkedAttributeData[this.allAttributeData[i].id]) {
        this.allAttributeData[i]['checked'] = true;
        attributeList.push(this.allAttributeData[i]);
      } else {
        this.allAttributeData[i]['checked'] = false;
      }
    }

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
}

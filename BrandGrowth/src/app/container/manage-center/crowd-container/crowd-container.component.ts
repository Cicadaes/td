import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';
const _ = require('lodash');

import { Store } from '@ngrx/store';
import * as reducer from './../../../ngrx/reducer';

// import Services
import { PeoplegroupSourceService } from '../../../services/source/peoplegroup.source.service';
import { DictSourceService } from '../../../services/source/dict.source.service';

// import contants
import { tags as crowdTags } from './../../../constants/crowd-attribute';

@Component({
  selector: 'crowd-container',
  templateUrl: './crowd-container.component.html',
  styleUrls: ['./crowd-container.component.less'],
  providers: [PeoplegroupSourceService, AsyncPipe, DictSourceService],
  encapsulation: ViewEncapsulation.None
})
export class CrowdContainerComponent implements OnInit {
  // table内容
  columns = [
    {
      title: '人群名称',
      key: 'name',
      width: '25%',
    },
    {
      title: '人群属性',
      key: 'crowdAttr',
      width: '40%',      
      html: true,
    },
    {
      title: '创建时间',
      key: 'time',
      width: '25%',
    },
    {
      title: '操作',
      key: 'handle',
      width: '10%',
      html: true
    },
  ];

  data: any[] = []; // 表格内容

  regionList: any[] = []; // 行政区域列表

  // 受众管理列表
  crowdList: any = [];
  searchValue: string = '';  // 搜索内容
  displayData: any = [];     // 包含checked字段的受众管理列表，最多10个

  @ViewChild('crowdAttr') crowdAttrRef: TemplateRef<any>;
  @ViewChild('crowdAttr', { read: ViewContainerRef }) crowdAttrVcRef: ViewContainerRef;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private store$: Store<reducer.State>,
    private asyncPipe: AsyncPipe,
    private peoplegroupSourceService: PeoplegroupSourceService,
    private dictSourceService: DictSourceService
  ) {  }

  ngOnInit() {
    this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe((data: any) => {
      // 获取受众管理列表
      this.getCrowdList().subscribe((list: any) => {
        this.crowdList = list;
        this.data = [];  
        let arrTemp: any[] = [];
        this.dictSourceService.getRegionList().then((regionData: any) => {
          if(regionData && regionData.code === 200 && regionData.result) {
            this.regionList = regionData.result;
            list.map((item: any) => {     // 循环遍历将表格需要的内容push进数组
              arrTemp.push({
                id: item.id,            
                name: item.name,
                crowdAttr: this.generateDropDownOperation(item),
                time: moment(item.time).format('YYYY.MM.DD'),
                handle: this.generateEditOperation(['/manage-center/crowd/edit', item.name, item.id, {"labels":item.preferenceLabels,"areas":item.areas}]),
              })
            })
            this.data = _.cloneDeep(arrTemp);
          }
        });
      });
    })
  }

  /**
   * 生成一个dropdown，用于展现人物属性相关内容
   * @param {*} item 表格的内容
   * @returns {Element} 
   */
  generateDropDownOperation(item: any): Element {
    // 创建一个新标签
    let divTag = this.renderer.createElement('div');
    // 创建内嵌视图
    let context = this.sortPersonAttr(item);
    let embeddedView = this.crowdAttrVcRef.createEmbeddedView(this.crowdAttrRef, context);
    // 动态添加子节点
    embeddedView.rootNodes.forEach((node: any) => {
      this.renderer.appendChild(divTag, node);
    });

    return divTag;
  }

  /**
   * 整理人物属性
   * @param {*} item 
   * @returns {*} 
   */
  sortPersonAttr(item: any): any {
    let personAttrNum = 0,  // 人物属性数量
      personAttres = '',  // 人口属性数组
      areaNum = 0,        // 地理位置数量
      areas = '',         // 地理位置数组
      perferNum = 0,      // 应用偏好数量
      perferes = '';      // 应用偏好数组

    item.preferenceLabels.split(',').forEach((label: any) => {
      let title: any;
      title = this.parsePersonAttr(label, crowdTags['attr']);
      if (title) {
        personAttrNum++;
        personAttres = personAttres + title + ',';
      }
      title = this.parsePersonAttr(label, crowdTags['category']);
      if (title) {
        perferNum++;
        perferes = perferes + title + ',';
      }
    });

    item.areas.split(',').forEach((area: any) => {
      this.regionList.map((region: any) => {
        if (region.currCode == area) {
          areaNum++;
          areas = areas + region.city + ',';
        }
      });
    });

    return {
      personAttrNum,
      areaNum,
      perferNum,
      personAttres: personAttres.slice(0, -1),
      areas: areas.slice(0, -1),
      perferes: perferes.slice(0, -1)
    };
  }

  /**
   * 通过递归的形式获取对应的title
   * @param {string} label 
   * @param {*} tags crowdTags
   * @returns {*}
   */
  parsePersonAttr(label: string, tags: any): any {
    if (tags.code == label) {
      return tags.title;
    } else if (tags.children) {
      for (let i = 0; i < tags.children.length; i++) {
        for (let j = 0; j < tags.children[i].children.length; j++) {
          if (tags.children[i].children[j].code == label) {
            return tags.children[i].children[j].title;
          }
        }
      }
    }
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
    // localStorage.setItem('TD_BG_ACTIVITY_OPTION', JSON.stringify({ 'value': data.id, 'label': data.name }))
    return aTag;
  }

  /**
   * 获取受众管理列表
   */
  getCrowdList(): Observable<any> {
    return Observable.create((observer: any) => {
      this.peoplegroupSourceService.getPeoplegroupById().then((data: any) => {
        if (data.code === 200 && data.result) {
          observer.next(data.result);
        }
      })
    })
  }

  /**
   * 删除已选择的受众管理
   */
  deleteCrowd(): void {
    this.displayData.map((item: any) => {
      if (item.checked) {
        this.peoplegroupSourceService.deletePeoplegroupLabel(item.id).then((res: any) => {
          if (res.code == '200') {
            this.data = this.data.filter((old: any) => {
              return old.id !== item.id;
            })
          }
        });
      }
    });
  }

  /**
   * 当列表被选的时候，获取列表
   * @param list list
   */
  getDisplayData(list: any) {
    this.displayData = list;
  }

  /**
   * 跳转到新建人群页面
   * @param {*} name 
   */
  create(name: any) {
    this.router.navigate(['/manage-center/crowd/create', name])
  }

}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as reducer from './../../../../ngrx/reducer';

// import Contants
import { tags } from '../../../../constants/crowd-attribute';

// import Service
import { PeoplegroupSourceService } from '../../../../services/source/peoplegroup.source.service';
import { DictSourceService } from '../../../../services/source/dict.source.service';

const _ = require('lodash');

@Component({
  selector: 'create-crowd-container',
  templateUrl: './create-crowd-container.component.html',
  styleUrls: ['./create-crowd-container.component.less'],
  providers:[
    PeoplegroupSourceService,
    DictSourceService
  ],
})
export class CreateCrowdContainerComponent implements OnInit {
  private _isEditable: boolean = false; // 是否处于编辑状态

  id: any;  // 受众id
  name: any;    // 人群标签名称
  labels: any;  // 人群标签
  areas: any;   // 地域标签

  attr: any;         // 人口属性
  city: any;         // 地理位置
  cityTmp: any = [];
  category: any;     // 应用偏好

  dataList: any = [];    // 右侧数据列表
  secondData: any = [];  // 第二列数据
  thirdData: any = [];   // 第三列数据
  firstId: any = [];     // 第一列控制下级箭头
  secondId: any = [];    // 第二列控制下级箭头

  constructor(
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private peoplegroupSourceService: PeoplegroupSourceService,
    private dictSourceService: DictSourceService
  ) { 
    this.attr = _.cloneDeep(tags.attr);
    this.city = _.cloneDeep(tags.city);
    this.category = _.cloneDeep(tags.category);
  }

  ngOnInit() {
    this.getAreas().then((data: any) => {
      tags.city.children = data;
    });
    this.activeRoute.paramMap.subscribe((params: ParamMap) => {
        // 判断是否是编辑操作, 如果id存在，就认为是编辑
        if(params.get("id")) {
          this._isEditable = true;
        } 
        this.reset();
    })
  }

  /**
   * 展开下一级菜单
   * @param {*} data 
   * @param {*} level
   * @param {*} [type] 
   */
  nextLevel(data: any, level: any, type?: any): void {
    if(level == '1'){
      this.secondData = data.children;
      this.thirdData = data.children[0].children;
      this.firstId = data.code;
      this.secondId = data.children[0].code;
    } else if(level == '2') {
      this.secondId = data.code;
      this.thirdData = data.children;
    }
  }

  /**
   * 删除列表数据
   * @param index 删除项在dataList中的位置
   * @param code 删除项对应的code
   */
  deleteData(index: number, code: string) {
    // 从dataList删除
    this.dataList.splice(index, 1);
    // 将选中状态置为false
    let total = ((children: any) => {
      children.forEach((item: any) => {
        let n = 0;
        let len = item.children.length;
        item.children.forEach((child: any) => {
          if (child.code == code) {
            child.isSelect = false;
          }
          if (child.isSelect == false) {
            n++;
          }
        });
        // 如果不是全选
        item.indeterminate = (n !== len && n !== 0);
        // 如果是全选
        item.isSelect = (n === 0);
      });
    });
    total(this.attr.children);
    total(this.city.children);
    total(this.category.children);
  }

  /**
   * 改变下一级选中状态
   * @param flag 选中状态 false 未选中 true 选中
   * @param item 第二级列表中被选中项
   */
  updateAllChecked(flag: boolean, item: any) {
    item.indeterminate = false;
    item.children.forEach((el: any) => {
      el.isSelect = flag;
    });
    this.totalSelectedItem();
  }
 
  /**
   * 改变同一级其他元素选中状态
   * @param flag 选中状态 false 未选中 true 选中
   * @param item 第二级列表中被选中项
   */
  updateSingleChecked(flag: any, item: any) {
    // 遍历二级列表的所有children内容，如果不是全选，将indeterminate置为true，反之false
    let currSecondItem: any; // 当前选中的二级项
    this.secondData.forEach((sd: any) => {
      if(sd.code == this.secondId) {
        currSecondItem = sd;
      }
    });

    let n = 0;                                // 记录未选中项的数目
    let len = currSecondItem.children.length; // 记录所有项的数目

    // 遍历选中的二级项下的所有子项内容，记录未选中项的数目
    currSecondItem.children.forEach((ci: any) => {
      if(ci.isSelect == false) {
        n++;
      }
    });

    // 如果不是全选
    currSecondItem.indeterminate = (n !== len && n !== 0);
    // 如果是全选
    currSecondItem.isSelect = (n === 0);

    this.totalSelectedItem();
  }

  /**
   * 统计选中项
   */
  totalSelectedItem() {
    this.dataList = [];
    // attr, city, category
    let n = 0;
    let total = ((children: any) => {
      children.forEach((item: any) => {
        item.children.forEach((child: any) => {
          if (child.isSelect) {
            this.dataList.push({
              title: child.title,
              code: child.code
            });
          }
        });
      });
    });
    total(this.attr.children);
    total(this.city.children);
    total(this.category.children);
  }

  /**
   * 确认提交
   */
  confirm(form: any) {
    if (!this.name) return;
    let labels = '', areas = '';
    let total = ((children: any) => {
      let str = '';
      (() => children.forEach((item: any) => {
        item.children.forEach((child: any) => {
          if (child.isSelect) {
            str += child.code + ',';
          }
        });
      }))()
      return str;
    });
    // 拼接labels
    labels += total(this.attr.children);
    labels += total(this.category.children);
    // 拼接areas
    areas += total(this.city.children);
    if (this._isEditable) {
      let params = { id: this.id, name: this.name };
      if (!!labels) params['labels'] = labels.slice(0, -1);
      if (!!areas) params['areas'] = areas.slice(0, -1);
      // 调用更新人群接口
      this.peoplegroupSourceService.updatePeoplegroup(params).then((data: any) => {
        if(data.code == 200) {
          this.router.navigate(['/manage-center/crowd']);
        }
      });
    } else {
      let params = { name: this.name };
      if (!!labels) params['labels'] = labels.slice(0, -1);
      if (!!areas) params['areas'] = areas.slice(0, -1);
      // 调用新建人群接口
      this.peoplegroupSourceService.creatPeoplegroup(params).then((data: any) => {
        if(data.code == 200) {
          this.router.navigate(['/manage-center/crowd']);
        }
      });
    }
  }

  /**
   * 重置
   */
  reset() {
    if (this._isEditable) {
      // 首先初始化tags
      this.attr = _.cloneDeep(tags.attr);
      this.city = _.cloneDeep(tags.city);
      this.category = _.cloneDeep(tags.category);
      // 初始化人群名称和ID
      this.activeRoute.paramMap.subscribe((params: ParamMap) => {
        // 判断是否是编辑操作, 如果id存在，就认为是编辑
        this.id = params.get("id");
        this.name = params.get("name");
      })
      // 解析labels和areas
      this.activeRoute.paramMap.subscribe((params: ParamMap) => {
        // 判断是否是编辑操作, 如果id存在，就认为是编辑
        let labels = params.get("labels");
        let areas = params.get("areas");

        let parse = ((children: any, arr: any[]) => {
          arr.forEach((label: any) => {
            children.forEach((item: any) => {
              let n = 0; // 负责记录未选中的个数
              let len = item.children.length; // 当前项chidlren的长度
              item.children.forEach((child: any) => {
                if (child.code == label) {
                  child.isSelect = true;
                }
                if (child.isSelect) {
                  n++;                  
                }
              });
              // 如果不是全选
              item.indeterminate = (n !== len && n !== 0);
              // 如果是全选
              item.isSelect = !(n === 0);
            });
          })
        });
        parse(this.attr.children, labels.split(","));
        parse(this.category.children, labels.split(","));
        parse(this.city.children, areas.split(","));
        this.totalSelectedItem();
      });
    } else {
      // 首先初始化tags
      this.attr = _.cloneDeep(tags.attr);
      this.city = _.cloneDeep(tags.city);
      this.category = _.cloneDeep(tags.category);
    }
    this.firstId = this.attr.code;
    this.secondId = this.attr.children[0].code;
    this.secondData = this.attr.children;
    this.thirdData = this.attr.children[0].children;
  }

  /**
   * 获取行政区域列表
   */
  getAreas() {
    return new Promise((resolve: any, reject: any) => {
      this.dictSourceService.getRegionList().then((data: any) => {
        if (data && data.code == 200 && data.result) {
          let arrTmp: any[] = []; // 用来保存整理后的行政区划
          data.result.forEach((city: any) => {
            let currItem = arrTmp.find((item) => {
              return item.code === city.parentCode
            });
            if (currItem) {
              currItem.children.push({
                isSelect: false,
                title: city.city,
                code: city.currCode,
              });
            } else {
              arrTmp.push({
                isSelect: false,
                title: city.province,
                code: city.parentCode,
                indeterminate: false,
                children: [
                  {
                    isSelect: false,
                    title: city.city,
                    code: city.currCode,
                  }
                ],
              });
            }
          });
          resolve(arrTmp);
        }
      });
    })
  }
}

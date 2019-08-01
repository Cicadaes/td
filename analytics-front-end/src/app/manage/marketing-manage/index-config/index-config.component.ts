import { Component, OnInit } from '@angular/core';
import { MarketingManageService } from '../marketing-manage.service';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-index-config',
  templateUrl: './index-config.component.html',
  styleUrls: ['./index-config.component.less']
})
export class IndexConfigComponent implements OnInit {
  productId: number; // 产品ID
  indexData: any; // 指标table Data
  indexTableLoading: boolean; // 指标table的loading
  pageSizeOptions: any[]; // 指标table 分页options
  itemObj: any; // 删除指标维度相关信息
  addFlag = false; // 新建指标弹框显示flag
  isVisible = false;
  removeFlag = false; // 删除弹框
  _item: any; // 待删除的某条数据
  // 分页数据
  _pageIndex = 1; // 当前页
  _pageSize = 10; // 每页条数
  _total = 1; // 数据总量
  parmas: any = {}; // 查询指标列表参数
  editData: any; // 编辑时的当前数据
  editFlag: boolean;
  serachParam: any;
  ruleFlag: boolean; // 规则/条件
  triggerFlag: boolean; // 触发器-指标
  planFlag: boolean; // 计划目标

  constructor(private marketingManageService: MarketingManageService, private notification: NzNotificationService) {}

  ngOnInit() {
    if (localStorage.getItem('productId')) {
      this.productId = Number(localStorage.getItem('productId'));
    }

    this.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;
    this.parmas = {
      page: 1,
      pageSize: 10,
      productId: this.productId
    };
    this.getIndexList(this.parmas);
  }

  /* 指标列表查询 */
  getIndexList(value: any) {
    this.marketingManageService.getIndexList(value).subscribe((response: any) => {
      this.indexTableLoading = false;
      if (response.code === 200) {
        response.data.data.map(one => {
          one.scope = one.scope.split(',');
        });
        this.indexData = response.data.data;
        this._total = response.data.total;
      } else {
        this.notification.create('warning', '错误提示', response.message);
      }
    });
  }

  // 改变页码
  PageIndexChange(e: number) {
    this.indexData = [];
    if (this._pageIndex === e) {
      this.parmas.page = e;
      this.indexTableLoading = true;
      this.getIndexList(this.parmas);
    } else {
      this._pageIndex = e;
    }
  }

  // 改变每页数量
  PageSizeChange(e: any) {
    this.indexTableLoading = true;
    this.parmas.pageSize = this._pageSize;
    this.PageIndexChange(1);
  }

  /**
   * 根据name搜索指标列表
   */
  serach(event: any) {
    const that = this;
    if (event.keyCode === 13) {
      that.indexTableLoading = true;
      that._pageIndex = 1;
      that.parmas.page = that._pageIndex;
      if (that.serachParam) {
        that.parmas.name = that.serachParam;
      } else {
        if (that.parmas.name) {
          delete that.parmas.name;
        }
      }
      that.getIndexList(that.parmas);
    }
  }

  // 新建维度  -- 弹框
  create() {
    this.isVisible = true;
    this.editFlag = false;
  }

  // 隐藏新建维度 -- 弹框
  hideDialog(type: any) {
    this.isVisible = false;
    this.editFlag = false;
  }

  // 保存维度结果
  saveDate() {
    this.isVisible = false;
    this.indexTableLoading = true;
    this.getIndexList(this.parmas);
  }

  // 编辑人群维度
  edit(item: any) {
    this.isVisible = true;
    this.editFlag = true;
    this.editData = item;
  }

  // 删除指标
  delete(item: any) {
    this.removeFlag = true;
    this._item = item;
    if (item.status === 0) {
      this.itemObj = {
        type: 'information',
        message: `请确认是否禁用指标"${this._item['name']}"?`,
        status: 1
      };
      // this._item.status = 0;
    } else {
      // this._item.status = 1;
      this.itemObj = {
        type: 'information',
        message: `请确认是否启用指标"${this._item['name']}"?`,
        status: 0
      };
    }
  }

  // 确定删除
  confirmHideDialog(type: any) {
    const that = this;
    if (this._item.status === 0) {
      this._item.status = -1;
    } else {
      this._item.status = 0;
    }
    this._item.scope = this._item.scope.join(',');
    this.marketingManageService.updateIndex(that._item).subscribe(
      response => {
        if (response.code === 200) {
          this.removeFlag = false;
          that.indexTableLoading = true;
          this.getIndexList(this.parmas);
        } else {
          this.removeFlag = false;
          this.notification.create('warning', '错误提示', response.message);
        }
      },
      (err: any) => {
        this.removeFlag = false;
      }
    );
  }

  // 取消删除
  hideItemDialog(type: any) {
    this.removeFlag = false;
  }
}

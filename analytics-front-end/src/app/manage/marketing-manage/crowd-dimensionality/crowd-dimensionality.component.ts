import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { MarketingManageService } from '../marketing-manage.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-crowd-dimensionality',
  templateUrl: './crowd-dimensionality.component.html',
  styleUrls: ['./crowd-dimensionality.component.less']
})
export class CrowdDimensionalityComponent extends BaseComponent implements OnInit, OnChanges {
  crowdData: any; // 人群维度table Data
  crowdTableLoading: boolean; // 人群维度table的loading
  pageSizeOptions: any[]; // 人群维度table 分页options
  itemObj: any; // 删除人群维度相关信息
  addFlag = false; // 新建人群维度弹框显示flag
  isVisible = false;
  removeFlag = false; // 删除弹框
  _item: any; // 待删除的某条数据
  // 分页数据
  _pageIndex = 1; // 当前页
  _pageSize = 10; // 每页条数
  _total = 1; // 数据总量
  parmas: any = {}; // 查询人群画像组列表参数
  editData: any; // 编辑时的当前数据
  editFlag: boolean;
  serachParam: any;

  constructor(private injector: Injector, private marketingManageService: MarketingManageService) {
    super(injector);
  }

  ngOnInit() {
    this.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;
    this.parmas = {
      page: 1,
      pageSize: 10,
      productId: this.productId
    };
    this.getCrowdList(this.parmas);
  }

  /* 人群维度列表查询 */
  getCrowdList(value: any) {
    this.marketingManageService.getCrowdList(value).subscribe((response: any) => {
      this.crowdTableLoading = false;
      if (response.code === 200) {
        this.crowdData = response.data.data;
        this._total = response.data.total;
      } else {
        this.notification.create('warning', '错误提示', response.message);
      }
    });
  }

  // 改变页码
  PageIndexChange(e: number) {
    this.crowdData = [];
    if (this._pageIndex === e) {
      this.parmas.page = e;
      this.crowdTableLoading = true;
      this.getCrowdList(this.parmas);
    } else {
      this._pageIndex = e;
    }
  }

  // 改变每页数量
  PageSizeChange(e: any) {
    this.crowdTableLoading = true;
    this.parmas.pageSize = this._pageSize;
    this.PageIndexChange(1);
  }

  /**
   * 根据name搜索人群维度列表
   */
  serach(event: any) {
    const that = this;
    if (event.keyCode === 13) {
      that.crowdTableLoading = true;
      that._pageIndex = 1;
      that.parmas.page = that._pageIndex;
      if (that.serachParam) {
        that.parmas.name = that.serachParam;
      } else {
        if (that.parmas.name) {
          delete that.parmas.name;
        }
      }
      that.getCrowdList(that.parmas);
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
    this.crowdTableLoading = true;
    this.getCrowdList(this.parmas);
  }

  // 编辑人群维度
  edit(item: any) {
    this.isVisible = true;
    this.editFlag = true;
    this.editData = item;
  }

  // 删除人群维度
  delete(item: any) {
    this.removeFlag = true;
    this._item = item;
    if (item.status === 0) {
      this.itemObj = {
        type: 'information',
        message: `请确认是否禁用人群维度"${this._item['name']}"?`,
        status: 1
      };
      // this._item.status = 0;
    } else {
      // this._item.status = 1;
      this.itemObj = {
        type: 'information',
        message: `请确认是否启用人群维度"${this._item['name']}"?`,
        status: 0
      };
    }
    // this.removeFlag = true;
    // this._item = item;
    // this.itemObj = {
    //     type: 'delete',
    //     message: `请确认是否删除人群维度${this._item['name']}?`
    // };
  }

  // 确定删除
  confirmHideDialog(type: any) {
    const that = this;
    if (this._item.status === 0) {
      this._item.status = -1;
    } else {
      this._item.status = 0;
    }
    this.marketingManageService.updateDimension(that._item).subscribe(
      response => {
        if (response.code === 200) {
          this.removeFlag = false;
          that.crowdTableLoading = true;
          this.getCrowdList(this.parmas);
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

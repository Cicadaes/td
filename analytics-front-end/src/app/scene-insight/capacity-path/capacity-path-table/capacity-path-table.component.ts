import { Component, SimpleChanges, Input, Injector } from '@angular/core';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { CapacityPathService } from '../capacity-path.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-capacity-path-table',
  templateUrl: './capacity-path-table.component.html',
  styleUrls: ['./capacity-path-table.component.less']
})
export class CapacityPathTableComponent extends BaseComponent {
  @Input() filter: '';
  @Input() isVisitor: any;
  capacityData: any = []; // 智能路径table Data
  capacityTableLoading: boolean; // 智能路径table的loading
  pageSizeOptions: any[]; // 智能路径table 分页options

  _moreSearchFieldArray: any[] = []; // 更多搜索条件
  itemObj: any; // 删除人群画像组的相关信息
  removeFlag = false; // 删除弹框
  _item: any; // 待删除的某条数据
  // 分页数据
  _current = 1; // 当前页
  _pageSize = 10; // 每页条数
  _total = 1; // 数据总量
  parmas: any = {}; // 查询人群画像组列表参数
  _name: any;
  _sourceId = '';

  constructor(private injector: Injector, private capacityPathService: CapacityPathService) {
    super(injector);
  }

  ngOnInit() {
    this._moreSearchFieldArray = [
      {
        fieldName: 'name',
        fieldLabel: '智能路径名称',
        fieldType: 'input'
      },
      {
        fieldName: 'startPointName',
        fieldLabel: '起始点',
        fieldType: 'input'
      },
      {
        fieldName: 'endPointName',
        fieldLabel: '终止点',
        fieldType: 'input'
      },
      {
        fieldName: 'status',
        fieldLabel: '计算状态',
        fieldType: 'select',
        apiData: false,
        initValue: '',
        selectOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '未开始'
          },
          {
            value: '2',
            label: '计算中'
          },
          {
            value: '3',
            label: '计算完成'
          },
          {
            value: '-1',
            label: '计算失败'
          }
        ]
      }
    ];
    this.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;
  }

  /* 智能路径列表查询 */
  getPortrait() {
    const params = this.parmas;
    params.page = this._current;
    params.rows = this._pageSize;
    params.productid = this.globals.getProductIdByStorage();
    params.sourceid = this._sourceId;
    this.capacityTableLoading = true;
    this.capacityPathService.query(params).subscribe((response: any) => {
      this.capacityTableLoading = false;
      console.dir([response]);
      if (response) {
        this.capacityData = response.rows;
        this._total = response.total;
      }
    });
  }

  // 改变页码
  PageIndexChange(e: number) {
    this.capacityData = [];
    if (this._current === e) {
      this.parmas.page = e;
      this.capacityTableLoading = true;
      this.getPortrait();
    } else {
      this._current = e;
    }
  }

  // 改变每页数量
  PageSizeChange(e: any) {
    this.capacityTableLoading = true;
    //        this.parmas.rows = this._pageSize;
    this.PageIndexChange(1);
  }

  // 新建智能路径
  create() {
    if (this.isVisitor && this.filter) {
      this.commonService.goInto({
        name: '',
        url: '/scene-insight/capacity-path/add',
        params: {
          sourceId: this._sourceId,
          tag: this.filter
        }
      });
    } else {
      this.commonService.goInto({
        name: '',
        url: '/scene-insight/capacity-path/add',
        params: {}
      });
    }
  }

  // 查看
  detail(item: any) {
    // console.log(item);
    this.commonService.goInto({
      name: '',
      url: '/scene-insight/capacity-path/view',
      params: {
        id: item.id
      }
    });
  }

  // 编辑
  edit(item: any) {
    if (this.isVisitor && this.filter) {
      this.commonService.goInto({
        name: '',
        url: '/scene-insight/capacity-path/edit',
        params: {
          id: item.id,
          sourceId: this._sourceId,
          tag: this.filter
        }
      });
    } else {
      this.commonService.goInto({
        name: '',
        url: '/scene-insight/capacity-path/edit',
        params: {
          id: item.id
        }
      });
    }
  }

  // 删除
  delete(item: any) {
    // console.log(item);
    this._item = item;
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: `确定要删除智能路径"${this._item['name']}"？`,
      nzOnOk: () => {
        const params = {
          id: this._item.id
        };
        this.capacityPathService.delete(params).subscribe((response: any) => {
          console.dir([response]);
          if (response && response.success) {
            this.message.create('success', `智能路径"${this._item['name']}"删除成功`);
            this.getPortrait();
          } else {
            this.message.create('error', `智能路径"${this._item['name']}"删除失败`);
          }
        });
      }
    });
  }

  // 确定删除 todo -del
  confirmHideDialog(type: any) {
    // this.capacityTableLoading = true;
    const params = {
      id: this._item.id
    };
    this.capacityPathService.delete(params).subscribe((response: any) => {
      console.dir([response]);
      if (response && response.success) {
        this.message.create('success', `智能路径"${this._item['name']}"删除成功`);
        this.removeFlag = type;
        this.getPortrait();
      } else {
        this.message.create('error', `智能路径"${this._item['name']}"删除失败`);
      }
    });
  }

  // 取消删除
  hideItemDialog(type: any) {
    this.removeFlag = type;
  }

  recompute(item: any) {
    const params = {
      id: item.id
    };
    this.capacityPathService.recompute(params).subscribe((response: any) => {
      console.dir([response]);
      if (response && response.success) {
        this.message.create('success', `智能路径"${item['name']}"重新计算成功`);
        this.getPortrait();
      } else {
        this.message.create('error', response.msg);
      }
    });
  }

  // 条件搜索
  onSearchMoreSearch(params: any) {
    this.parmas = params;
    this.getPortrait();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isVisitor && changes.isVisitor.currentValue) {
      this._name = changes.filter
        ? changes.filter.currentValue == 'miniprogram'
          ? '小程序'
          : changes.filter.currentValue
        : '';
      if (!changes.filter) {
        this.getPortrait();
      } else {
        this.getSourceId();
      }
    } else {
      this.getPortrait();
    }
  }

  getSourceId() {
    const that = this;
    const json = {
      sdkName: that.filter,
      productId: that.productId
    };
    that.capacityPathService.getSourceId(json).subscribe((response: any) => {
      if (response && response.list.id) {
        that._sourceId = response.list.id;
        that.getPortrait();
      }
    });
  }
}

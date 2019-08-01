import { Component, OnInit, Injector, OnChanges } from '@angular/core';
import { BaseComponent } from '../../../common/base-component';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { ApplyManageService } from '../apply-manage.service';

@Component({
  selector: 'app-sms-edm',
  templateUrl: './sms-edm.component.html',
  styleUrls: ['./sms-edm.component.less']
})
export class SmsEdmComponent extends BaseComponent implements OnInit, OnChanges {
  tableData: any; // 渠道列表table Data
  tableLoading = true; // 渠道列表table的loading
  pageSizeOptions: any[]; // 渠道列表table 分页options
  _pageIndex = 1; // 当前页
  _pageSize = 10; // 每页条数
  _total = 1; // 数据总量
  parmas: any = {}; // 查询渠道列表参数
  editDataSms: any; // 编辑时的当前数据
  editDataEdm: any;
  serachParam: any;
  addSmsFlag = false; // 新建短信渠道弹框
  addEdmFlag = false; // 新建邮件渠道弹框
  editSmsFlag: boolean; // 编辑短信
  editEdmFlag: boolean; // 编辑邮件
  channelType: any; // 渠道类型
  itemObj: any; // 删除渠道相关信息
  removeFlag = false; // 删除弹框
  _item: any; // 待删除的某条数据
  detailSmsFlag = false; // 查看
  detailDataSms: any;
  detailEdmFlag = false;
  detailDataEdm: any;

  constructor(private injector: Injector, private applyManageService: ApplyManageService) {
    super(injector);
  }

  ngOnInit() {
    this.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;
    this.parmas = {
      page: 1,
      pageSize: 10,
      productId: this.productId
    };
    this.getChannelConfig(this.parmas);
  }

  /* 人群维度列表查询 */
  getChannelConfig(value: any) {
    this.applyManageService.getChannelConfig(value).subscribe((response: any) => {
      this.tableLoading = false;
      if (response.code === 200) {
        this.tableData = response.data.data;
        this._total = response.data.total;
        this.tableLoading = false;
      } else {
        this.notification.create('warning', '错误提示', response.message);
      }
    });
  }

  // 改变页码
  PageIndexChange(e: number) {
    this.tableData = [];
    if (this._pageIndex === e) {
      this.parmas.page = e;
      this.tableLoading = true;
      this.getChannelConfig(this.parmas);
    } else {
      this._pageIndex = e;
    }
  }

  // 改变每页数量
  PageSizeChange(e: any) {
    this.tableLoading = true;
    this.parmas.pageSize = this._pageSize;
    this.PageIndexChange(1);
  }

  /**
   * 根据name搜索通道列表
   */
  serach(event: any) {
    const that = this;
    if (event.keyCode === 13) {
      that.tableLoading = true;
      that._pageIndex = 1;
      that.parmas.page = that._pageIndex;
      if (that.serachParam) {
        that.parmas.name = that.serachParam;
      } else {
        if (that.parmas.name) {
          delete that.parmas.name;
        }
      }
      that.getChannelConfig(that.parmas);
    }
  }

  // 新建通道 弹框
  create(type: any) {
    this.channelType = type;
    if (type === '2' || type === 2) {
      // 短信
      this.addSmsFlag = true;
      this.editSmsFlag = false;
    } else {
      // 邮件
      this.addEdmFlag = true;
      this.editEdmFlag = false;
    }
  }

  // 隐藏新建通道-- 弹框
  hideDialog(type: any) {
    if (this.channelType === '2' || this.channelType === 2) {
      // 短信
      this.addSmsFlag = false;
    } else {
      // 邮件
      this.addEdmFlag = false;
    }
    // this.isVisible = false;
  }

  // 隐藏查看-- 弹框
  hideDetailDialog(type: any) {
    if (this.channelType === '2' || this.channelType === 2) {
      // 短信
      this.detailSmsFlag = false;
    } else {
      // 邮件
      this.detailEdmFlag = false;
    }
  }

  // 保存通道结果
  saveDate() {
    if (this.channelType === '2' || this.channelType === 2) {
      // 短信
      this.addSmsFlag = false;
    } else {
      // 邮件
      this.addEdmFlag = false;
    }
    // this.isVisible = false;
    this.tableLoading = true;
    this.getChannelConfig(this.parmas);
  }

  // 查看通道
  detail(item: any) {
    this.channelType = item.channelType;
    if (this.channelType === '2' || this.channelType === 2) {
      // 短信
      this.detailSmsFlag = true;
      this.detailDataSms = item;
    } else {
      // 邮件
      this.detailEdmFlag = true;
      this.detailDataEdm = item;
    }
  }

  //  编辑通道
  edit(item: any) {
    this.channelType = item.channelType;
    if (this.channelType === '2' || this.channelType === 2) {
      // 短信
      this.addSmsFlag = true;
      this.editSmsFlag = true;
      this.editDataSms = item;
    } else {
      // 邮件
      this.addEdmFlag = true;
      this.editEdmFlag = true;
      this.editDataEdm = item;
    }
  }

  // 删除通道
  delete(item: any) {
    this.removeFlag = true;
    this._item = item;
    if (item.status === 0) {
      this.itemObj = {
        type: 'information',
        message: `请确认是否禁用渠道配置"${this._item['name']}"?`,
        status: 1
      };
      // this._item.status = 0;
    } else {
      // this._item.status = 1;
      this.itemObj = {
        type: 'information',
        message: `请确认是否启用渠道配置"${this._item['name']}"?`,
        status: 0
      };
    }
  }

  // 确定删除
  confirmHideDialog(type: any) {
    if (this._item.status === 0) {
      this._item.status = -1;
    } else {
      this._item.status = 0;
    }
    this.applyManageService.updateChannelConfig(this._item).subscribe(
      response => {
        if (response.code === 200) {
          this.removeFlag = false;
          this.tableLoading = true;
          this.getChannelConfig(this.parmas);
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

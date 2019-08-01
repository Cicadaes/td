import { Component, OnInit } from '@angular/core';
import { BtlSourceService } from '../../../services/source/btl.source.service';
// cosmos 全局提示
import { CmMessageService } from 'ng-cosmos-td-ui';
import { Router } from '@angular/router';
import nzGlobalMonitor from '../../../utils/nz-global-monitor';

@Component({
  selector: 'btl-container',
  templateUrl: './btl-container.component.html',
  styleUrls: ['./btl-container.component.less'],
  providers: [
    BtlSourceService,
  ],
})
export class BtlContainerComponent implements OnInit {

  private noTableResult: string = '加载中...'; // 表格没数据时内容
  private _tableData: any = [];
  // 检索字段
  private btlFilter: any = '';
  constructor(
    private router: Router,
    private btlSourceService: BtlSourceService,
    private cmMessageService: CmMessageService,
  ) {}

  ngOnInit() {
    this.getListData();
  }

  // 获取线下区域列表数据
  getListData() {
    this.btlSourceService.getBtlList().then((res: any) => {
      if (res.code === 200) {
        const data = res.result;
        const list = data.map((item: any) => {
          // 类型 1为探针 2为POI
          const type = item.type === 1 ? '探针' : 'POI';
          item.typeCn = type;
          return item;
        });
        this.noTableResult = list.length === 0 ? '暂无数据' : '';
        this._tableData = list;
        this.onChangeChecked();
      }
    });
  }

  private _allChecked: boolean = false; // 全选状态
  private _indeterminate: boolean = false; // 列表包含选中项状态
  private selectedList: any[] = []; // 已选项信息
  onChangeChecked() {
    const allChecked = this._tableData.every((value: any) => value.checked === true);
    const allUnChecked = this._tableData.every((value: any) => !value.checked);
    const selectList = this._tableData.filter((x: any) => x.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
    this.selectedList = selectList;
  }

  _checkAll(type: any) {
    if (type) {
      this._tableData.forEach((data: any) => data.checked = true);
    } else {
      this._tableData.forEach((data: any) => data.checked = false);
    }
    this.onChangeChecked();
  }
  
  create() {
    this.router.navigate(['/manage-center/btl/operation-btl']);
  }

  /**
   * 跳转编辑页面
   * @param info [当前区域的类型]
   */
  onEdit(info: any) {
    this.router.navigate(['/manage-center/btl/edit-btl', info.typeCn], {
      queryParams: {
        name: info.name,
        id: info.id,
      },
    });
  }

  // 执行删除操作
  private deleteLoading: boolean = false; // 删除操作的loading
  onDelete() {
    const delList: any[] = [];
    this.selectedList.forEach((item: any) => {
      const id = item.id;
      delList.push(this.btlSourceService.onDeleteBtl(id));
    });
    // 删除
    if (delList.length > 0) {
      // 增加全局loading
      this.deleteLoading = true;
      nzGlobalMonitor.setDocumentOverflowHidden(true);
        
      Promise.all(delList).then((item: any) => {
        const flag = item.every((x: any) => x.code === 200);
        // 取消全局loading
        this.deleteLoading = false;
        nzGlobalMonitor.setDocumentOverflowHidden(false);
        if (flag) {
          this.cmMessageService.success('删除成功！', {
            nzDuration: 2000,
          });
          this.getListData();
        } else {
          this.getListData();
        }
      });
    }
  }
}

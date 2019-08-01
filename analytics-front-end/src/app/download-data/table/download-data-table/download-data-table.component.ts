import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DownloadDataService } from '../../download-data.service';
import { NzModalService } from 'ng-zorro-antd';
import { Globals } from '../../../utils/globals';

@Component({
  selector: 'app-download-data-table',
  templateUrl: './download-data-table.component.html',
  styleUrls: ['./download-data-table.component.less'],
  providers: [DownloadDataService]
})
export class DownloadDataTableComponent implements OnInit, OnChanges {
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  dataSet = [];
  loading = true;
  sortValue = null;
  sortKey = null;
  searchGenderList: string[] = [];

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData();
  }

  reload() {
    this.searchData(false);
  }

  constructor(private service: DownloadDataService, private modalService: NzModalService, public globals: Globals) {}

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    const param = {
      productid: this.globals.getProductIdByStorage(),
      page: this.pageIndex,
      rows: this.pageSize
    };
    this.service.queryDatas(param).subscribe((response: any) => {
      this.loading = false;
      this.total = response.total;
      this.dataSet = response.list;
    });
  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.searchData(true);
  }

  download(data: any) {
    if (data && data.id) {
      window.open(`${this.service.downloadUrl}?id=${data.id}`);
    }
  }

  updateTempJobretry(data: any) {
    const param = {
      id: data.id
    };

    this.service.updateTempJobretry(param).subscribe((response: any) => {
      this.modalService.success({
        nzTitle: '提示',
        nzContent: '恭喜您，重试成功'
      });
      this.searchData(false);
    });
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit(): void {
    this.searchData();
  }
}

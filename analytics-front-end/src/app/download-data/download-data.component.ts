import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { BaseComponent } from '../common/base-component';

@Component({
  selector: 'app-download-data',
  templateUrl: './download-data.component.html',
  styleUrls: ['./download-data.component.less']
})
export class DownloadDataComponent extends BaseComponent implements OnInit, OnChanges {
  constructor(private injector: Injector) {
    super(injector);
    this.initRouterList('数据下载');
  }

  ngOnInit() {}
}

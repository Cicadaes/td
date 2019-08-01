import { Component, OnInit } from '@angular/core';
import { AppInfoService } from './app-info.service';
import { Globals } from '../../../utils/globals';

@Component({
  selector: 'app-app-info',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.less'],
  providers: [AppInfoService]
})
export class AppInfoComponent implements OnInit {
  _appInfo: any;

  constructor(private service: AppInfoService, public globals: Globals) {}

  queryAppInfo() {
    const param = {
      id: this.globals.getProductIdByStorage()
    };
    this.service.getAppInfo(param).subscribe((response: any) => {
      if (response && response.list) {
        this._appInfo = response.list;
      }
    });
  }

  ngOnInit() {
    this.queryAppInfo();
  }
}

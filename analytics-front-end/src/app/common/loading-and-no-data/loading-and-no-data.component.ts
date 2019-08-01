import { Component, OnInit, Input, Injector } from '@angular/core';
import { BaseComponent } from '../base-component';

@Component({
  selector: 'app-loading-and-no-data',
  templateUrl: './loading-and-no-data.component.html',
  styleUrls: ['./loading-and-no-data.component.less']
})
export class LoadingAndNoDataComponent extends BaseComponent implements OnInit {
  @Input() isLoading: boolean = false; // 加载中
  @Input() isNoData: boolean = false; // 暂无数据

  constructor(baseInjector: Injector) {
    super(baseInjector);
  }

  ngOnInit() {}
}

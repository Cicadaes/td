import { Component, OnInit, Injector } from '@angular/core';
import { EarlyWarningService } from './early-warning.service';
import { BaseComponent } from 'src/app/common/base-component';

@Component({
  selector: 'app-early-warning',
  templateUrl: './early-warning.component.html',
  styleUrls: ['./early-warning.component.css']
})
export class EarlyWarningComponent extends BaseComponent implements OnInit {
  tabList: any = [
    {
      url: '/early-warning/warning-rule',
      name: '预警规则'
    },
    {
      url: '/early-warning/warning-history',
      name: '告警历史'
    }
  ];

  constructor(private injector: Injector, private pageService: EarlyWarningService) {
    super(injector);
    this.initRouterList('业务预警');
  }

  ngOnInit() {}
}

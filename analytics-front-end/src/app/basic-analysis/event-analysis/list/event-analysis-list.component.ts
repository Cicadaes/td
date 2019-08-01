import { Component, Injector, OnInit } from '@angular/core';
import { EventAnalysisService } from '../event-analysis.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-event-analysis-list',
  templateUrl: './event-analysis-list.component.html',
  styleUrls: ['./event-analysis-list.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisListComponent extends BaseComponent implements OnInit {
  constructor(public service: EventAnalysisService, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {}
}

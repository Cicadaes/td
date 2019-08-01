import { Component, Injector, OnInit } from '@angular/core';
import { EventAnalysisService } from './event-analysis.service';
import { BaseComponent } from '../../common/base-component';

@Component({
  selector: 'app-event-analysis',
  templateUrl: './event-analysis.component.html',
  styleUrls: ['./event-analysis.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisComponent extends BaseComponent implements OnInit {
  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {}
}

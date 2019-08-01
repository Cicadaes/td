import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.less']
})
export class ReportPreviewComponent implements OnInit {
  @Input() reportType: any;
  @Output() closeSider = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  closeSiderBar() {
    this.closeSider.emit(false);
  }

}

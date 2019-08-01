import { Component, OnInit, Output, EventEmitter, Input, ContentChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import csv from './../../utils/export-csv'

@Component({
  selector: 'common-search-card',
  templateUrl: './common-search-card.component.html',
  styleUrls: ['./common-search-card.component.less']
})
export class CommonSearchCardComponent {
  @Output() 
  onSearchChange = new EventEmitter<any>();

  @Input()
  dataSource: any = [];

  @Input()
  csvParams: any;

  @ContentChild('addOnBefore') _addOnHeaderBefore: TemplateRef<void>;

  searchInputChange(event: any) {
    this.onSearchChange.emit(event);
  }

  download() {
    csv.download(this.csvParams.filename, this.csvParams.data);
  }
}

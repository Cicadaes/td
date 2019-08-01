import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as reducer from './../../../ngrx/reducer';

@Component({
  selector: 'filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.less']
})
export class FilterBarComponent implements OnInit {
  guard$: Observable<any>;

  @Input()
  itemList: any[];

  @Input()
  activityList: any;

  constructor(private store: Store<reducer.State>) {
    this.guard$ = this.store.select('guard');
  }

  ngOnInit() {
    
  }

}

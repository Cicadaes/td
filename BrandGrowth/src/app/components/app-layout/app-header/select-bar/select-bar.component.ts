import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import * as global from './../../../../ngrx/action/global';
import * as reducer from './../../../../ngrx/reducer';
import { Store } from '@ngrx/store';
import { MARKETING_CENTER_ITEM_LIST } from './../../../../constants/marketing-center';

@Component({
  selector: 'select-bar',
  templateUrl: './select-bar.component.html',
  styleUrls: ['./select-bar.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SelectBarComponent implements OnInit {
  @Input()
  itemList: any[];

  selectItem: any = MARKETING_CENTER_ITEM_LIST[0];

  constructor(private store$: Store<reducer.State>) { }

  ngOnInit() {
    this.store$.select('global').distinctUntilChanged().subscribe((data: any) => {
      if (data && data.selectItem) {
        this.selectItem = data.selectItem;
      }
    });
  }
}

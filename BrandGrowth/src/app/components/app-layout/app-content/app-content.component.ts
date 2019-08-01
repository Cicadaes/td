import {
  Component,
  ViewChild,
  Renderer2,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as reducer from './../../../ngrx/reducer';

@Component({
  selector: 'app-content',
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'overflow-y: auto;flex: 1 1 0',
  },
})
export class AppContentComponent implements OnInit {
  guard$: Observable<any>;

  ngOnInit() {
  }

  constructor(private _renderer: Renderer2, private store: Store<reducer.State>) {
    this.guard$ = this.store.select('guard');
  }
}

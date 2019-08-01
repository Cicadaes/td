import { Component, OnInit, Input } from '@angular/core';
// , ChangeDetectionStrategy

@Component({
  selector: 'proportion-ranking',
  templateUrl: './proportion-ranking.component.html',
  styleUrls: ['./proportion-ranking.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProportionRankingComponent implements OnInit {
  private _data: { name: string, value: number }[] = [];

  @Input() rankTitle: boolean = true;

  @Input()
  set data(value: { name: string, value: number }[]) {
    this._data = value;
  }

  get data(): { name: string, value: number }[] {
    return this._data;
  }

  constructor() { }

  ngOnInit() {
  }

}

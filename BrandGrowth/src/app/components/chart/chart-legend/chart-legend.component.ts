import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.less'],
})
export class ChartLegendComponent implements OnChanges, OnInit {
  @Input() config: any[] = [];
  @Input() valueUnit: string = '';
  // Hover行效果
  @Output() onHoverList = new EventEmitter<number>();
  @Output() onMouseLeave = new EventEmitter();

  constructor() { }

  private _list: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    const configData = changes.config;
    //  && !!configData.currentValue.length
    if (configData && configData.currentValue) {
      // if (configData.currentValue.length > 0) {
        this._list = configData.currentValue;
      // }
    }
  }

  onHover(index: number) {
    this.onHoverList.emit(index);
  }

  onLeave(index: number) {
    this.onMouseLeave.emit(index);
  }

  ngOnInit() {
  }
}

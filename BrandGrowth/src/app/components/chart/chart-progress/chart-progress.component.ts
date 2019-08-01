import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'chart-progress',
  templateUrl: './chart-progress.component.html',
  styleUrls: ['./chart-progress.component.less']
})
export class ChartProgressComponent implements OnInit {

  private _formatNull = (value: string) => ('');
  @Input() colorIndex: number | string = '1';
  @Input() progressColor: string = '#3399ff';
  @Input() progressName: string = '';
  @Input() progressValue: number | string = '0';

  private _color = 'color-1';
  
  constructor() { }

  ngOnInit() {
    this._color = `color-${this.colorIndex}`;
  }

}

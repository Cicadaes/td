import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  ViewChild,
  ElementRef,
  TemplateRef,
  ContentChild,
  SimpleChanges,
  EventEmitter
} from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'effect-template',
  templateUrl: './effect-template.component.html',
  styleUrls: ['./effect-template.component.less'],
  providers: [DecimalPipe, PercentPipe]
})
export class EffectTemplateComponent implements OnInit {
  @Input() topTitle: string = '';
  @Input() desc: string = '';
  @Input() itemList: any[] = [];
  @Input() selectedItemTag: any;
  @Input() contentValue: any = [];

  @ContentChild('moreDetail') moreDetailElementRef: TemplateRef<void>;
  @ContentChild('extra') extraElementRef: TemplateRef<void>;

  @Output() onVated = new EventEmitter();
  @Output() onDeleteItem = new EventEmitter();

  lineChart: any = { 
    "legend": { 
      "data": ["到访人数", "新访客"]
    }, 
    "xAxis": { 
      "data": ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"] 
    }, 
    "series": [
      { 
        "name": "到访人数", 
        "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        "showSymbol": false 
      }, 
      { 
        "name": "新访客", 
        "showSymbol": false, 
        "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
      }
    ]
  };

  constructor(
    private decimalPipe: DecimalPipe,
    private percentPipe: PercentPipe
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  /**
   * 将数值格式化
   * @param num 数
   * @param type 类型，number和percent
   */
  filterNumber(num: number, type: string) {
    if (type === 'number') {
      return this.decimalPipe.transform(num);
    } else if (type === 'percent') {
      return this.percentPipe.transform(num);
    }
    return 'N/A';
  }

  changeSelectItem(tag: any) {
    this.onVated.emit(tag);
  }

  delete(tag: any) {
    this.onDeleteItem.emit(tag);
  }
}

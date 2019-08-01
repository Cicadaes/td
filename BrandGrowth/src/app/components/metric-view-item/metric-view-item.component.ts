import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { toBoolean } from '../../utils/convert';

@Component({
  selector: 'metric-view-item',
  templateUrl: './metric-view-item.component.html',
  styleUrls: ['./metric-view-item.component.less'],
})
export class MetricViewItemComponent implements OnInit {

  @Output() onClickMetric = new EventEmitter();

  private _left = false;
  private _horizontal = false;
  private _metricClass = '';

  @Input() metricTitle: string; // 标题
  @Input() metricInfo: string; // 内容
  @Input() metricInfoSize: (number | string); // 内容字体大小
  // 是否展示左侧边框 默认不展示
  @Input()
  set left(value: boolean) {
    this._left = toBoolean(value);
  }
  get left(): boolean {
    return this._left;
  }

  // 横向排列标示 默认纵向排列
  @Input()
  set horizontal(value: boolean) {
    this._horizontal = toBoolean(value);
  }
  get horizontal(): boolean {
    return this._horizontal;
  }
  @Input()
  set metricClass(value: string) {
    this._metricClass = value;
  }
  get metricClass() {
    return this._metricClass;
  }

  @ContentChild('metricContent') metricContent: TemplateRef<void>;

  // watch => 样式Class
  currentClasses: {}; // 组件 class样式
  fontStyle: {}; // 内容字体样式
  setFontStyles() { // 内容部分的内联样式
    this.fontStyle = {
      'font-size': `${this.metricInfoSize}px`,
      'line-height': `${this.metricInfoSize}px`,
      'margin-top': this.metricInfoSize && this.metricInfoSize > 24 ? '15px' : '18px',
    };
  }
  setCurrentClasses() { // 组件 Class样式
    this.currentClasses = {
      'metric-view-item-horizontal': this.horizontal,
      'metric-view-item-left': this.left,
      [this.metricClass]: true,
    };
  }

  onClick() {
    this.onClickMetric.emit();
  }
  
  ngOnInit() {
    this.setFontStyles();
    this.setCurrentClasses();
  }
}

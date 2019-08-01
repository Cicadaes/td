import {
  Component,
  Input,
  OnInit,
  OnChanges,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'slider-metric',
  templateUrl: './slider-metric.component.html',
  styleUrls: ['./slider-metric.component.less'],
})
// 高度  flex
export class SilderMetricComponent implements OnChanges, OnInit {
  @Input() metricData: any = [];
  @Output() onClick = new EventEmitter();
  private len: number;
  private Con: number = 0;
  private leftAllowed: any = {
    cursor: 'pointer',
    color: 'rgba(28, 36, 56, 1)',
  };
  private rightAllowed: any = {
    cursor: 'pointer',
    color: 'rgba(28, 36, 56, 1)',
  };
  private style: any = {
    'margin-left.px': 0,
    transition: 'margin-left 0.5s'
  };
  @Input() checked: any;

  constructor() {}
  
  ngOnInit() {
    /* this.len = this.metricData.length;
    // 初始化ul的宽度
    this.style = {
      width: `${230 * this.len}px`,
      'margin-left.px': 0,
    }
    this.leftMouse();
    this.rightMouse(); */
  }

  ngOnChanges(change: SimpleChanges) {
    const metricData = change.metricData;
    const value = metricData.currentValue;
    if (value !== undefined && value !== null) {
      this.len = this.metricData.length;
      // 初始化ul的宽度
      this.style = {
        width: `${230 * this.len}px`,
        'margin-left.px': 0,
      }
      this.leftMouse();
      this.rightMouse();
      if (this.len > 0) {
        this.onclick(0);
      }
    }
  }

  // 判断左右箭头是否可以点击
  leftMouse() {
    /* if (this.Con <= 0) {
      this.leftAllowed = {
        cursor: 'not-allowed',
        color: 'rgba(28, 36, 56, 0.32)',
      }
    } else {
      this.leftAllowed = {
        cursor: 'pointer',
        color: 'rgba(28, 36, 56, 1)',
      }
    } */
    this.leftAllowed = this.Con <= 0 ? {
      cursor: 'not-allowed',
      color: 'rgba(28, 36, 56, 0.32)',
    } : {
      cursor: 'pointer',
      color: 'rgba(28, 36, 56, 1)',
    };
  }
  rightMouse() {
    /* if (this.Con >= (this.len - 5)) {
      this.rightAllowed = {
        cursor: 'not-allowed',
        color: 'rgba(28, 36, 56, 0.32)',
      }

    } else {
      this.rightAllowed = {
        cursor: 'pointer',
        color: 'rgba(28, 36, 56, 1)',
      }
    } */
    this.rightAllowed = this.Con >= (this.len - 5) ? {
      cursor: 'not-allowed',
      color: 'rgba(28, 36, 56, 0.32)',
    } : {
      cursor: 'pointer',
      color: 'rgba(28, 36, 56, 1)',
    };
  }
  left() {
    /* if (this.Con <= 0) {
      return;
    } else {
      this.Con--;
      this.style = {
        width: `${230 * this.len}px`,
        'margin-left.px': -(230 * this.Con),
        transition: 'margin-left 0.5s'
      }
    } */
    if (this.Con !== 0) {
      this.Con --;
      this.style = {
        width: `${230 * this.len}px`,
        'margin-left.px': -(230 * this.Con),
        transition: 'margin-left 0.5s'
      };
      this.leftMouse();
      this.rightMouse();
    }
  }
  right() {
    /* if (this.Con >= (this.len - 5)) {
      return;
    } else {
      this.Con++;
      this.style = {
        width: `${230 * this.len}px`,
        'margin-left.px': -(230 * this.Con),
        transition: 'margin-left 0.5s'
      }
    } */
    if (this.Con < (this.len - 5)) {
      this.Con ++;
      this.style = {
        width: `${230 * this.len}px`,
        'margin-left.px': -(230 * this.Con),
        transition: 'margin-left 0.5s'
      };
      this.leftMouse();
      this.rightMouse();
    }
  }
  onclick(i: any) {
    this.checked = i;
    this.onClick.emit(i);
  }
}
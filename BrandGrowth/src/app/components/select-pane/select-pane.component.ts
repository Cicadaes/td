import { 
  Component, 
  OnInit, 
  OnChanges, 
  Input, 
  forwardRef, 
  HostListener, 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  Renderer2,
  SimpleChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'select-pane',
  templateUrl: './select-pane.component.html',
  styleUrls: ['./select-pane.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectPaneComponent),
      multi: true
    }
  ],
})
export class SelectPaneComponent implements OnInit, ControlValueAccessor {
  @Input() title: string;

  _value: any[];             // ngModel双向绑定的值
  _composing = false;        // 与ngModel相关
  indeterminate = false;     // 是否没有全部被选中
  allSelect: any = {
    isSelect: false,
    indeterminate: false,
  };

  @ViewChild('operator') operaotrRef: ElementRef;
  @Output() onAfterViewInit = new EventEmitter();

  fold: boolean = false;     // 默认折叠

  _shouldFold: boolean = true;
  @Input()
  set shouldFold(flag: boolean) {
    if (!flag) this.fold = true;
    this._shouldFold = flag;
    this.cdRef.detectChanges();
  }

  get shouldFold(): boolean {
    return this._shouldFold;
  }

  // ngModel Access
  onChange: (value: any[]) => void = () => null;
  onTouched: () => void = () => null;

  @HostListener('compositionstart', ['$event'])
  compositionStart(e: CompositionEvent): void {
    this._composing = true;
  }

  @HostListener('compositionend', ['$event'])
  compositionEnd(e: CompositionEvent): void {
    this._composing = false;
    this.onChange(this._value);
  }

  constructor(private cdRef: ChangeDetectorRef, private renderer: Renderer2) {

  }

  ngOnInit() {  }

  ngAfterViewInit() {
    this.onAfterViewInit.emit(this._value);
  }

  /**
   * 全选
   * @param flag 
   */
  selectAll(flag: boolean): void {
    let len = this._value.length;
    for (let i = 0; i < len; i ++) this.selectGroup(flag, this._value[i])
  }

  /**
   * 单选
   * @param flag 
   */
  selectSingle(flag: boolean, item: any, group: any): void {
    item.isSelect = flag;
    // 计算单个一组内是否全部被选中
    let count = 0;
    let len = group.children.length;
    group.children.forEach((option: any) => {
       if (option.isSelect) count++;
    });
    group.indeterminate = count !== len && count !== 0;
    group.isSelect = count === len;

    // 计算总的是否全部被选中
    count = 0;                 // indeterminate 是否全为true
    len = this._value.length;  
    let n = 0;                 // isSelect 是否全为true
    this._value.forEach((el: any) => {
      if (el.isSelect) n++;
      if (el.indeterminate) count++;
    });
    this.allSelect.indeterminate = (count !== len && count !== 0) || (n !== len && n !== 0 && count === 0);
    this.allSelect.isSelect = n === len && count === 0;

    this.onChange(this._value);
  }

  /**
   * 全选一组
   * @param flag
   * @param item
   */
  selectGroup(flag: boolean, item: any): void {
    item.isSelect = flag;
    item.indeterminate = false;

    if (!item.children) return;

    item.children.forEach((el: any) => {
      this.selectSingle(flag, el, item);
    });
  }

  writeValue(value: any[]): void {
    this._value = value;
    if (Object.prototype.toString.call(value) == '[object Array]') {
      value.forEach((item: any) => {
        if (item.children && Object.prototype.toString.call(item.children) == '[object Array]') {
          item.children.forEach((child: any) => {
            this.selectSingle(child.isSelect, child, item);
          });
        }
      });
    }
  }

  registerOnChange(fn: (_: any[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

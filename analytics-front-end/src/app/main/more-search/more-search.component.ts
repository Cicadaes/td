import { Component, Input, Output, EventEmitter, Injector } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BaseComponent } from '../../common/base-component';

@Component({
  selector: 'app-more-search',
  templateUrl: './more-search.component.html',
  styleUrls: ['./more-search.component.less']
})
export class MoreSearchComponent extends BaseComponent {
  @Input() fieldArray: any[];
  @Output() onSearch = new EventEmitter<boolean>();
  noLimit: boolean;
  @Input() refresh: EventEmitter<any>;

  isResetComponents = false;
  isCollapse = true;
  validateForm: FormGroup;
  defaultNumber: number;
  isShowCollapse: boolean;
  _noLimit: boolean;

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
    this.fieldArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < this.defaultNumber : true;
    });
  }

  selectSearchControl(value: any, control: any) {
    this.validateForm.controls[control.fieldName].setValue(value);
  }

  _getZeroDateRange(date: any) {
    let zeroDate;
    if (date && date.start && date.end) {
      zeroDate = {
        start: this.globals.getDateZeroTime(date.start) || null,
        end: date.end || null
      };
    }
    return zeroDate;
  }

  dateRangeControl(date: any, control: any) {
    const zeroDate = this._getZeroDateRange(date);
    this.validateForm.controls[control.fieldName].setValue(zeroDate);
  }

  resetMoreSearchForm() {
    this.resetComponents();
    this.validateForm.reset();
    this.onSearch.emit(this.validateForm.value);
  }

  resetComponents() {
    this.isResetComponents = true;
    setTimeout(() => {
      this.isResetComponents = false;
    }, 100);
  }

  searchMoreSearchForm(validateForm: any) {
    //    this.formTransform.objTrim(validateForm.value)
    //        const baseUrl = this.router.url.split('?')[0];
    //        const url = baseUrl + '?' + encodeURI(JSON.stringify({type: 'search', data: validateForm.value}));

    this.onSearch.emit(validateForm.value);
  }

  constructor(private injector: Injector, private fb: FormBuilder) {
    super(injector);
  }

  checkIsShowCollapse(): void {
    if (this.fieldArray && this.fieldArray.length > this.defaultNumber) {
      this.isShowCollapse = true;
    }
  }

  trim(str: string) {
    if (str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    } else {
      return '';
    }
  }

  changeInputValue(obj: any, fieldName: string) {
    const value = obj.target.value;
    this.componentChange(this.trim(value), fieldName);
  }

  componentChange(value: any, fieldName: string) {
    if (this.checkHasFieldName(fieldName)) {
      this.validateForm.controls[fieldName].setValue(value);
    }
  }

  checkHasFieldName(fieldName: string) {
    let has = false;
    for (const o in this.validateForm.controls) {
      if (fieldName && fieldName === o) {
        has = true;
        break;
      }
    }
    return has;
  }

  buildFileArray(): void {
    this.validateForm = this.fb.group({});
    if (this.fieldArray && this.fieldArray.length > 0) {
      for (let i = 0; i < this.fieldArray.length; i++) {
        if (i < this.defaultNumber) {
          this.fieldArray[i].show = true;
        }
        this.validateForm.addControl(this.fieldArray[i].fieldName, new FormControl());
      }
    }
  }

  ngOnInit() {
    this.defaultNumber = 6;
    this._noLimit = true;
    this.checkIsShowCollapse();
    this.buildFileArray();

    /*const param: any = this.getUrlParam();
         if (param) {
         this.onSearch.emit(param);
         this.setValidateV(param);
         }*/
  }

  /**
   * 去除字符串尾首的空格
   * @param  {any}    data [description]
   * @return {[type]}      [description]
   */
  private valueTrim(data: any) {
    // 这里不支持ES8的新功能
    for (const key of Object.keys(data)) {
      typeof data[key] === 'string' && data[key].trim && (data[key] = data[key].trim());
    }
  }

  /**
   * 获取参数
   * @return {[type]} [description]
   */
  private getUrlParam() {
    const fullPa: any = this.router.url.split('?')[1];
    const deCodeparam: any = fullPa && fullPa.split('=')[0];
    const param: any = deCodeparam && JSON.parse(decodeURI(deCodeparam)).data;

    return param;
  }

  /**
   * 设置搜索项的值
   * @param  {any}    obj [description]
   * @return {[type]}     [description]
   */
  private setValidateV(obj: any) {
    for (const item in this.validateForm.controls) {
      this.validateForm.controls[item].setValue(obj[item]);
    }

    this.fieldArray.forEach((item: any, index: number) => {
      if (item.fieldType === 'select') {
        item.initValue = obj[item.fieldName];
      }
    });
  }

  formatterInputNumber(value: any, control: any) {
    if (value && control && control.fieldType === 'integer') {
      if (value.toString().indexOf('.') !== -1) {
        setTimeout(() => {
          this.componentChange(parseInt(value.toString(), 10), control['fieldName']);
        }, 10);
      }
    }
  }
}

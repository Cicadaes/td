import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ObjectTrimService } from '../../@core/utils/object-trim.service';

@Component({
  selector: 'more-search',
  templateUrl: './more-search.component.html',
  styleUrls: ['./more-search.component.css']
})

export class MoreSearchComponent implements OnInit {
  @Input() fieldArray: any[];
  @Input() rowCount: any = 8;
  @Output() onSearch = new EventEmitter<boolean>();
  noLimit = true;
  @Input() refresh: EventEmitter<any>;


  isResetComponents = false;
  isCollapse = true;
  validateForm: FormGroup;
  defaultNumber = 3;
  isShowCollapse = false;

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
    this.fieldArray.forEach((c, index) => {
      c.show = this.isCollapse ? (index < this.defaultNumber) : true;
    });
  }

  selectSearchControl(value: any, control: any) {
    this.validateForm.controls[control.fieldName].setValue(value);
  }

  dateRangeControl(date: any, control: any) {
    this.validateForm.controls[control.fieldName].setValue(date);
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
    this.formTransform.objTrim(validateForm.value);
    const baseUrl = this.router.url.split('?')[0];
    // let url = baseUrl + '?' + encodeURI(JSON.stringify(validateForm.value))
    const url = baseUrl + '?' + encodeURI(JSON.stringify({ type: 'search', data: validateForm.value }))

    // this.router.navigateByUrl(url);

    this.onSearch.emit(validateForm.value);
  }

  constructor(private router: Router, private fb: FormBuilder, private formTransform: ObjectTrimService) {
  }

  checkIsShowCollapse(): void {
    if (this.fieldArray && this.fieldArray.length > this.defaultNumber) {
      this.isShowCollapse = true;
    }
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
    this.checkIsShowCollapse();
    this.buildFileArray();

    // const param: any = this.getUrlParam();
    // if (param) {
    //   this.onSearch.emit(param);
    //   this.setValidateV(param);
    // }
  }

  /**
   * 去除字符串尾首的空格
   * @param  {any}    data [description]
   * @return {[type]}      [description]
   */
  private valueTrim(data: any) {
    // 这里不支持ES8的新功能
    for (let key of Object.keys(data)) {
      (typeof data[key] == 'string') && data[key].trim && (data[key] = data[key].trim());
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
    for (let item in this.validateForm.controls) {
      this.validateForm.controls[item].setValue(obj[item])
    }

    this.fieldArray.forEach((item: any, index: number) => {
      if (item.fieldType === 'select') {
        item.initValue = obj[item.fieldName];
      }
    });
  }




}

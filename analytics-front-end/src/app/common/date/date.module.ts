/** 配置 angular i18n **/
import { registerLocaleData, CommonModule } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);

/** 配置 ng-zorro-antd 国际化 **/
import { NZ_I18N, en_US, NgZorroAntdModule } from 'ng-zorro-antd';
/*********/
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateComponent } from './date.component';

@NgModule({
  declarations: [DateComponent],
  imports: [CommonModule, FormsModule, NgZorroAntdModule],
  exports: [DateComponent],
  /** 配置 ng-zorro-antd 国际化 **/
  providers: [{ provide: NZ_I18N, useValue: en_US }]
})
export class DateModule {}

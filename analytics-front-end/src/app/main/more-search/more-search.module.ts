import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MoreSearchComponent } from './more-search.component';
import { SelectSearchModule } from '../select/select-search/select-search.module';
import { DateRangeModule } from '../date/date-range/date-range.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule, SelectSearchModule, DateRangeModule],
  declarations: [MoreSearchComponent],
  exports: [MoreSearchComponent]
})
export class MoreSearchModule {}

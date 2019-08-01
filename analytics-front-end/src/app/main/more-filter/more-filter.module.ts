import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MoreFilterComponent } from './more-filter.component';
import { MoreFilterService } from './more-filter.service';

@NgModule({
  declarations: [MoreFilterComponent],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgZorroAntdModule],
  providers: [MoreFilterService],
  exports: [MoreFilterComponent]
})
export class MoreFilterModule {}

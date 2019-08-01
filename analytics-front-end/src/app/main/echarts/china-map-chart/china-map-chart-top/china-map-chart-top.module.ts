import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChinaMapChartTopComponent } from './china-map-chart-top.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule],
  providers: [],
  exports: [ChinaMapChartTopComponent],
  declarations: [ChinaMapChartTopComponent]
})
export class ChinaMapChartTopModule {}

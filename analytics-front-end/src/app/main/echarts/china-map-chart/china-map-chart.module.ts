import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChinaMapChartService } from './china-map-chart.service';
import { ChinaMapChartComponent } from './china-map-chart.component';
import { ChartModule } from '../../../common/chart/chart.module';
import { ChinaMapChartTopModule } from './china-map-chart-top/china-map-chart-top.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ChartModule, ChinaMapChartTopModule, NgZorroAntdModule],
  providers: [ChinaMapChartService],
  exports: [ChinaMapChartComponent],
  declarations: [ChinaMapChartComponent]
})
export class ChinaMapChartModule {}

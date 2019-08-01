import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSmsComponent } from './report-sms.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChartModule } from '../../../../common/chart/chart.module';
import { DateFormatPipeModule } from '../../../../../pipes/date-format-pipe';

@NgModule({
  imports: [CommonModule, NgZorroAntdModule, ChartModule, DateFormatPipeModule],
  declarations: [ReportSmsComponent],
  exports: [ReportSmsComponent]
})
export class ReportSmsModule {}

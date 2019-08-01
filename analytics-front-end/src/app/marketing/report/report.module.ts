import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChartModule } from '../../common/chart/chart.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmialComponent } from './emial/emial.component';
import { ReportEmailModule } from './report-module/report-email/report-email.module';
import { PushComponent } from './push/push.component';
import { ReportPushModule } from './report-module/report-push/report-push.module';
import { SmsComponent } from './sms/sms.component';
import { ReportSmsModule } from './report-module/report-sms/report-sms.module';
import { ReportService } from './report.service';
import { ReportEmailComponent } from './report-module/report-email/report-email.component';
import { ReportPushComponent } from './report-module/report-push/report-push.component';
import { ReportSmsComponent } from './report-module/report-sms/report-sms.component';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ChartModule,
    ReportEmailModule,
    ReportPushModule,
    ReportSmsModule,
    RouterModule.forChild([
      // 邮件投放
      {
        path: 'email',
        component: EmialComponent
      },
      // push投放
      {
        path: 'push',
        component: PushComponent
      },
      // 短信投放
      {
        path: 'sms',
        component: SmsComponent
      }
    ])
  ],
  declarations: [EmialComponent, SmsComponent, PushComponent],
  providers: [ReportService],
  exports: [ReportPushComponent, ReportEmailComponent, ReportSmsComponent]
})
export class ReportModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectReportComponent } from './effect-report.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { EffectReportRoutingModule } from './effect-report.routing';
import { EffectReportService } from './effect-report.service';
import { FunnelAnalysisComponent } from './funnel-analysis/funnel-analysis.component';
import { AddFunnelComponent } from './funnel-analysis/add-funnel/add-funnel.component';
import { ChartModule } from '../../common/chart/chart.module';
import { TargetAchievementComponent } from './target-achievement/target-achievement.component';
import { TabListModule } from '../../common/tab-list/tab-list.module';
import { ReportModule } from '../report/report.module';

@NgModule({
  imports: [
    CommonModule,
    EffectReportRoutingModule,
    FormsModule,
    ChartModule,
    TabListModule,
    ReportModule,
    NgZorroAntdModule.forRoot()
  ],
  declarations: [EffectReportComponent, FunnelAnalysisComponent, AddFunnelComponent, TargetAchievementComponent],
  providers: [EffectReportService]
})
export class EffectReportModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { ChartModule } from '../../common/chart/chart.module';
import { BehaviorAnalysisComponent } from './behavior-analysis.component';
import { NumberToThousandsPipeModule } from '../../../pipes/number-to-thousands-pipe';
import { CrowdFilterModule } from '../../main/crowd-filter/crowd-filter.module';
import { BehaviorAnalysisFilterComponent } from './filter/behavior-analysis-filter.component';
import { EventAttrsDialogComponent } from './dialog/event-attrs-dialog/event-attrs-dialog.component';
import { FastSearchModule } from '../../main/fast-search/fast-search.module';
import { DateFormatPipeModule } from '../../../pipes/date-format-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    RouterModule,
    ChartModule,
    NumberToThousandsPipeModule,
    CrowdFilterModule,
    FastSearchModule,
    DateFormatPipeModule
  ],
  declarations: [BehaviorAnalysisComponent, BehaviorAnalysisFilterComponent, EventAttrsDialogComponent]
})
export class BehaviorAnalysisModule {}

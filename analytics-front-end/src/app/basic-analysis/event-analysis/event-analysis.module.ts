import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { ChartModule } from '../../common/chart/chart.module';
import { EventAnalysisComponent } from './event-analysis.component';
import { NumberToThousandsPipeModule } from '../../../pipes/number-to-thousands-pipe';
import { CrowdFilterModule } from '../../main/crowd-filter/crowd-filter.module';
import { EventAnalysisDetailFilterComponent } from './detail/filter/event-analysis-detail-filter.component';
import { EventAnalysisDetailCompareComponent } from './detail/dialog/event-analysis-detail-compare.component';
import { FastSearchModule } from '../../main/fast-search/fast-search.module';
import { DateFormatPipeModule } from '../../../pipes/date-format-pipe';
import { EventAnalysisListComponent } from './list/event-analysis-list.component';
import { EventAnalysisDetailComponent } from './detail/event-analysis-detail.component';
import { EventAnalysisListTableComponent } from './list/table/event-analysis-list-table.component';
import { EventAnalysisListExportComponent } from './list/export/event-analysis-list-export.component';
import { HelpPopoverModule } from '../../main/popover/help-popover/help-popover.module';
import { EventAnalysisListFilterComponent } from './list/filter/event-analysis-list-filter.component';
import { EventAttributeBuilderModule } from './detail/filter/event-attribute-builder/event-attribute-builder.module';
import { EventFilterModule } from './detail/filter/event-filter/event-filter.module';
import { DownloadPopoverModule } from '../../main/popover/download-popover/download-popover.module';
import { LoadingAndNoDataModule } from 'src/app/common/loading-and-no-data/loading-and-no-data.module';
/*tslint:disable*/
import { EventAnalysisDetailTableComponent } from './detail/table/event-analysis-detail-table/event-analysis-detail-table.component';
import { EventAnalysisEventAttrTableComponent } from './detail/table/event-analysis-event-attr-table/event-analysis-event-attr-table.component';
import { EventAnalysisTagTableComponent } from './detail/table/event-analysis-tag-table/event-analysis-tag-table.component';
/*tslint:enable*/

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
    DateFormatPipeModule,
    HelpPopoverModule,
    EventAttributeBuilderModule,
    EventFilterModule,
    DownloadPopoverModule,
    LoadingAndNoDataModule
  ],
  declarations: [
    EventAnalysisComponent,
    EventAnalysisListComponent,
    EventAnalysisListTableComponent,
    EventAnalysisListFilterComponent,
    EventAnalysisListExportComponent,
    EventAnalysisDetailComponent,
    EventAnalysisDetailFilterComponent,
    EventAnalysisDetailCompareComponent,
    EventAnalysisDetailTableComponent,
    EventAnalysisEventAttrTableComponent,
    EventAnalysisTagTableComponent
  ]
})
export class EventAnalysisModule {}

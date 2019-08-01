import { NgModule } from '@angular/core';
import { ReportDetailService } from './report-detail.service';
import { ReportDetailComponent } from './report-detail.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportDetailTitleModule } from './report-detail-title/report-detail-title.module';
import { ChartDataCommunicationService } from '../service/chart-data.communication.service';
import { filterFixedService } from '../main/reportconfig/report/report-detail/filter-fixed/filter-fixed.service';
import { DynamicLoadComponent as DynamicComponent } from '../main/reportconfig/report/report-detail/dynamic-load-config/dynamic-load.component';
import { StyleDirective } from '../main/reportconfig/report/report-detail/dynamic-load-config/report-style.directive';
import { DataDirective } from '../main/reportconfig/report/report-detail/dynamic-load-config/report-data.directive';
import { filterFixedModule } from '../main/reportconfig/report/report-detail/filter-fixed/filter-fixed.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';

import PieConfigModule from '../../sdk-ui/components/angular/pie/pie.config.module';
import BarConfigModule from '../../sdk-ui/components/angular/bar/bar.config.module';
import LineConfigModule from '../../sdk-ui/components/angular/line/line.config.module';
import FunnelConfigModule from '../../sdk-ui/components/angular/funnel/funnel.config.module';
import SelectConfigModule from '../../sdk-ui/components/angular/select/select.config.module';
import GridConfigModule from '../../sdk-ui/components/angular/grid/grid.config.module';
import RetentionConfigModule from '../../sdk-ui/components/angular/retention/retention.config.module';
import RectangleConfigModule from '../../sdk-ui/components/angular/rectangle/rectangle.config.module';
import DateConfigModule from '../../sdk-ui/components/angular/date/date.config.module';
import TabConfigModule from '../../sdk-ui/components/angular/tab/tab.config.module';
import TitleConfigModule from '../../sdk-ui/components/angular/title/title.config.module';
import TableConfigModule from '../../sdk-ui/components/angular/table/table.config.module';
import FiltersConfigModule from '../../sdk-ui/components/angular/filters/filters.config.module';
import TextConfigModule from '../../sdk-ui/components/angular/text/text.config.module';
import AreaConfigModule from '../../sdk-ui/components/angular/area/area.config.module';
import StatisticsConfigModule from '../../sdk-ui/components/angular/statistics/statistics.config.module';
import MapConfigModule from '../../sdk-ui/components/angular/map/map.config.module';
import DayWeekMonthConfigModule from '../../sdk-ui/components/angular/dayWeekMonth/dayWeekMonth.config.module';
import EventImpactConfigModule from '../../sdk-ui/components/angular/eventImpact/eventImpact.config.module';


import { FunnelProcedureModule } from './../../sdk-ui/components/angular/funnel/funnel-data/funnel-data-procedure/funnel-procedure.module';
import { funnelProcedureService } from './../../sdk-ui/components/angular/funnel/funnel-data/funnel-data-procedure/funnel-procedure.service';

import { GridProcedureModule } from './../../sdk-ui/components/angular/grid/grid-style/grid-style-content/grid-style-content.module';
import { GridProcedureService } from './../../sdk-ui/components/angular/grid/grid-style/grid-style-content/grid-style-content.service';

import { TableProcedureModule } from './../../sdk-ui/components/angular/table/table-style/table-style-content/table-style-content.module';
import { TableProcedureService } from './../../sdk-ui/components/angular/table/table-style/table-style-content/table-style-content.service';

import { TitleProcedureModule } from './../../sdk-ui/components/angular/title/title-style/title-style-content/title-style-content.module';
import { TitleProcedureService } from './../../sdk-ui/components/angular/title/title-style/title-style-content/title-style-content.service';

// import { FiltersModule } from '../../sdk-ui/components/angular/filters/filters.module';
// import { filtersService } from '../../sdk-ui/components/angular/filters/filters.service';

import { textLinkModule } from './../../sdk-ui/components/angular/text/text-style/text-style-link/text-style-link.module';
import { textLinkService } from './../../sdk-ui/components/angular/text/text-style/text-style-link/text-style-link.service';
import UrlFilterConfigModule from '../../sdk-ui/components/angular/url-filter/url-filter.config.module';
import { ReportDetailRoutingModule } from './report-detail-routing.module';
import { BreadcrumbModule } from 'ng-cosmos-td-ui/src/base/breadcrumb/breadcrumb.module';

@NgModule({
    declarations: [
        ReportDetailComponent,
        DynamicComponent,
        StyleDirective,
        DataDirective,
    ],
    imports: [
        FormsModule,
        CommonModule,
        PieConfigModule,
        BarConfigModule,
        LineConfigModule,
        FunnelConfigModule,
        ReportDetailTitleModule,
        filterFixedModule,
        ButtonModule,
        RadioModule,
        FunnelProcedureModule,
        SelectConfigModule,
        GridConfigModule,
        RetentionConfigModule,
        GridProcedureModule,
        RectangleConfigModule,
        DateConfigModule,
        TabConfigModule,
        TitleConfigModule,
        TableConfigModule,
        TableProcedureModule,
        FiltersConfigModule,
        TitleProcedureModule,
        TextConfigModule,
        textLinkModule,
        UrlFilterConfigModule,
        AreaConfigModule,
        StatisticsConfigModule,
        MapConfigModule,
        DayWeekMonthConfigModule,
        ReportDetailRoutingModule,
        BreadcrumbModule,
        EventImpactConfigModule,
    ],
    providers: [
        ReportDetailService,
        filterFixedService,
        funnelProcedureService,
        GridProcedureService,
        TableProcedureService,
        TitleProcedureService,
        textLinkService,
    ]
})
export class ReportDetailModule {

}

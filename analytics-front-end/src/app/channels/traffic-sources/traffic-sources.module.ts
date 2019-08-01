import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartModule } from '../../common/chart/chart.module';
import { trafficSourcesService } from './traffic-sources.service';
import { filtersModule } from '../common/filter/filters.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { DateModule } from '../../common/date/date.module';
import { OverviewModule } from '../../common/overview/overview.module';
import { selectModule } from '../common/select/select.module';
import { trafficSourcesComponent } from './traffic-sources.component';
import { trafficSourcesSdetailsComponent } from '../traffic-sources-sdetails/traffic-sources-sdetails.component';
import { trafficSourcesSdetailsRoutingModule } from './traffic-sources.routing';
import { trafficSourcesSdetailsService } from './../traffic-sources-sdetails/traffic-sources-sdetails.service';
import { SourceSnalysish5Component } from './source-snalysis-h5/source-snalysis-h5.component';
import { SourceSnalysiswebComponent } from './source-snalysis-web/source-snalysis-web.component';
import { SourceSnalysisappComponent } from './source-snalysis-app/source-snalysis-app.component';
import { LoadingAndNoDataModule } from 'src/app/common/loading-and-no-data/loading-and-no-data.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ChartModule,
    trafficSourcesSdetailsRoutingModule,
    DateModule,
    filtersModule,
    NgxEchartsModule,
    OverviewModule,
    selectModule,
    LoadingAndNoDataModule
  ],
  declarations: [
    trafficSourcesComponent,
    trafficSourcesSdetailsComponent,
    SourceSnalysish5Component,
    SourceSnalysiswebComponent,
    SourceSnalysisappComponent
  ],
  providers: [trafficSourcesService, trafficSourcesSdetailsService]
})
export class trafficSourcesModule {}

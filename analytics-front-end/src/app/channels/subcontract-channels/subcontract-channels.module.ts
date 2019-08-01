import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartModule } from '../../common/chart/chart.module';
import { subcontractChannelsComponent } from './subcontract-channels.component';
import { subcontractChannelsService } from './subcontract-channels.service';
// tslint:disable-next-line
import { subcontractChannelsSdetailsService } from './../subcontract-channel-sdetails/subcontract-channel-sdetails.service';
import { subcontractChannelsRoutingModule } from './subcontract-channels.routing';
// tslint:disable-next-line
import { SubcontractChannelSdetailsComponent } from '../subcontract-channel-sdetails/subcontract-channel-sdetails.component';
import { filtersModule } from '../common/filter/filters.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { DateModule } from '../../common/date/date.module';
import { OverviewModule } from '../../common/overview/overview.module';
import { selectModule } from '../common/select/select.module';
import { RetentionModule } from '../../common/retention/retention.module';
import { LoadingAndNoDataModule } from 'src/app/common/loading-and-no-data/loading-and-no-data.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ChartModule,
    subcontractChannelsRoutingModule,
    DateModule,
    filtersModule,
    NgxEchartsModule,
    OverviewModule,
    selectModule,
    RetentionModule,
    LoadingAndNoDataModule
  ],
  declarations: [subcontractChannelsComponent, SubcontractChannelSdetailsComponent],
  providers: [subcontractChannelsService, subcontractChannelsSdetailsService]
})
export class subcontractChannelsModule {}

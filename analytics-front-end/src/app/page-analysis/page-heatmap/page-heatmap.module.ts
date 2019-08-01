import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PageHeatmapH5Component } from './page-heatmap-h5/page-heatmap-h5.component';
import { PageHeatmapRoutingModule } from './page-heatmap.routing';
import { PageHeatmapComponent } from './page-heatmap.component';
import { PageHeatmapWebComponent } from './page-heatmap-web/page-heatmap-web.component';
import { PageHeatmapIframeComponent } from './page-heatmap-iframe/page-heatmap-iframe.component';
import { PageHeatmapService } from './page-heatmap.service';
import { PageHeatmapTop10Component } from './page-heatmap-top10/page-heatmap-top10.component';
import { SelectSearchModule } from '../../main/select/select-search/select-search.module';
import { SelectCustomModule } from '../../main/select/select-custom/select-custom.module';
import { TabListModule } from '../../common/tab-list/tab-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeatmapRoutingModule,
    NgZorroAntdModule,
    SelectSearchModule,
    SelectCustomModule,
    TabListModule
  ],
  declarations: [
    PageHeatmapComponent,
    PageHeatmapH5Component,
    PageHeatmapWebComponent,
    PageHeatmapIframeComponent,
    PageHeatmapTop10Component
  ],
  providers: [PageHeatmapService]
})
export class PageHeatmapModule {}

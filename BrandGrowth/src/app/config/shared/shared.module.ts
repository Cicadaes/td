import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CosmosModule } from 'ng-cosmos-td-ui';

// import Components
import { CommonSearchCardComponent } from '../../components/common-search-card/common-search-card.component';
import { MetricViewItemComponent } from '../../components/metric-view-item/metric-view-item.component';
import { ChartBarComponent } from '../../components/chart/chart-bar/chart-bar.component';
import { CommonCardComponent } from '../../components/common-card/common-card.component';
import { ChartLineComponent } from '../../components/chart/chart-line/chart-line.component';
import { ChartPieComponent } from '../../components/chart/chart-pie/chart-pie.component';
import { ChartLegendComponent } from '../../components/chart/chart-legend/chart-legend.component';
import { ListIconRatioComponent } from '../../components/list-icon-ratio/list-icon-ratio.component';
import { ChartTreemapComponent } from '../../components/chart/chart-treemap/chart-treemap.component';
import { ChartMapComponent } from '../../components/chart/chart-map/chart-map.component';
import { ChartPolayComponent } from '../../components/chart/chart-polay/chart-polay.component';
import { ChartVennComponent } from '../../components/chart/chart-venn/chart-venn.component';
import { ProportionRankingComponent } from '../../components/proportion-ranking/proportion-ranking.component';
import { ChartTableWrapComponent } from '../../components/chart-table-wrap/chart-table-wrap.component';
import { TableMoveComponent } from '../../components/table-move/table-move.component';
import { CommonTableComponent } from '../../components/common-table/common-table.component';
import { OptionCardComponent } from '../../components/option-card/option-card.component';
import { PoiMapComponent } from '../../components/poi-map/poi-map.component';
import { SelectPaneComponent } from '../../components/select-pane/select-pane.component';
import { SilderMetricComponent } from '../../components/slider-metric/slider-metric.component';
import { ChartProgressComponent } from '../../components/chart/chart-progress/chart-progress.component';
import { ChartBubbleComponent } from '../../components/chart/chart-bubble/chart-bubble.component';
import { ChartRadarComponent } from '../../components/chart/chart-radar/chart-radar.component';

// import Pipes
import { FilterArrayPipe } from '../../pipes/filter-array.pipe';
import { FilterNumberPipe } from '../../pipes/filter-number.pipe';
import { FilterPercentPipe } from '../../pipes/filter-percent.pipe';

// import directive
import { RenderElementDirective } from '../../directives/renderElement.directive';

@NgModule({
  declarations: [
    CommonSearchCardComponent,
    MetricViewItemComponent,
    ChartBarComponent,
    CommonCardComponent,
    ChartLineComponent,
    ChartPieComponent,
    ChartLegendComponent,
    ListIconRatioComponent,
    ChartTreemapComponent,
    ChartMapComponent,
    ChartPolayComponent,
    ChartVennComponent,
    ProportionRankingComponent,
    ChartTableWrapComponent,
    FilterArrayPipe,
    FilterNumberPipe, 
    FilterPercentPipe,
    TableMoveComponent,
    CommonTableComponent,
    RenderElementDirective,
    OptionCardComponent,
    PoiMapComponent,
    SelectPaneComponent,
    SilderMetricComponent,
    ChartProgressComponent,
    ChartBubbleComponent,
    ChartRadarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CosmosModule,
    // NgZorroAntdModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonSearchCardComponent,
    CosmosModule,
    MetricViewItemComponent,
    ChartBarComponent,
    CommonCardComponent,
    ChartLineComponent,
    ChartPieComponent,
    ChartLegendComponent,
    ListIconRatioComponent,
    ChartTreemapComponent,
    ChartMapComponent,
    ChartPolayComponent,
    ChartVennComponent,
    ProportionRankingComponent,
    ChartTableWrapComponent,
    FilterArrayPipe,
    FilterNumberPipe,
    FilterPercentPipe,
    TableMoveComponent,
    CommonTableComponent,
    RenderElementDirective,
    OptionCardComponent,
    PoiMapComponent,
    SelectPaneComponent,
    SilderMetricComponent,
    ChartProgressComponent,
    ChartBubbleComponent,
    ChartRadarComponent,
    // NgZorroAntdModule,
  ],
  providers: [
    DecimalPipe,
    PercentPipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}


import { NgModule } from '@angular/core';

import AreaModule from './area/area.module';
import BarModule from './bar/bar.module';
import DateModule from './date/date.module';
import FiltersModule from './filters/filters.module';
import customfiltersModule from './customfilters/customfilters.module';
import FunnelModule from './funnel/funnel.module';
import GridModule from './grid/grid.module';
import LineModule from './line/line.module';
import MapModule from './map/map.module';
import PieModule from './pie/pie.module';
import RectangleModule from './rectangle/rectangle.module';
import RetentionModule from './retention/retention.module';
import FilterSelectModule from './select/select.module';
import StatisticsModule from './statistics/statistics.module';
import TabModule from './tab/tab.module';
import TextModule from './text/text.module';
import TitleModule from './title/title.module';
import CmTableModule from './table/table.module';
import DayWeekMonthModule from './dayWeekMonth/dayWeekMonth.module';
import EventImpactModule from './eventImpact/eventImpact.module';


@NgModule({
    imports: [
        AreaModule,
        BarModule,
        DateModule,
        FiltersModule,
        FunnelModule,
        GridModule,
        LineModule,
        MapModule,
        PieModule,
        RectangleModule,
        RetentionModule,
        FilterSelectModule,
        StatisticsModule,
        TabModule,
        TextModule,
        TitleModule,
        CmTableModule,
        DayWeekMonthModule,
        EventImpactModule,
        customfiltersModule,
    ]
})
export class AngularModule {

}
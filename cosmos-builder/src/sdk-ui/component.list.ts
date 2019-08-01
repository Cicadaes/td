import MyPieComponent from './components/pie';
import MyLineComponent from './components/line';
import MyFunnelComponent from './components/funnel';
import MyBarComponent from './components/bar';
import MyselectComponent from './components/select';
import MygridComponent from './components/grid';
import MyretentionComponent from './components/retention';
import MyrectangleComponent from './components/rectangle';
import MydateComponent from './components/date';
import MytabComponent from './components/tab';
import MytitleComponent from './components/title';
import MyTableComponent from './components/table';
import MyfiltersComponent from './components/filters';
import MyTextComponent from './components/text';
import MyAreaComponent from './components/area';
import MyStatisticsComponent from './components/statistics';
import MyMapComponent from './components/map';
import MyDayWeekMonthComponent from './components/dayWeekMonth';
import MyeventImpactComponent from './components/eventImpact';
import MycustomfiltersComponent from './components/customfilters';
import HorizontalLayoutComponent from './components/horizontal.layout.component';
import VerticalLayoutComponent from './components/vertical.layout.component';

import { PieStyleComponent } from "./components/angular/pie/pie-style/pie-style.component";
import { PieDataComponent } from './components/angular/pie/pie-data/pie-data.component';
import { LineStyleComponent } from "./components/angular/line/line-style/line-style.component";
import { LineDataComponent } from './components/angular/line/line-data/line-data.component';
import { FunnelStyleComponent } from "./components/angular/funnel/funnel-style/funnel-style.component";
import { FunnelDataComponent } from './components/angular/funnel/funnel-data/funnel-data.component';
import { BarStyleComponent } from './components/angular/bar/bar-style/bar-style.component';
import { BarDataComponent } from './components/angular/bar/bar-data/bar-data.component';
import { SelectStyleComponent } from "./components/angular/select/select-style/select-style.component";
import { SelectDataComponent } from './components/angular/select/select-data/select-data.component';
import { GridStyleComponent } from "./components/angular/grid/grid-style/grid-style.component";
import { GridDataComponent } from './components/angular/grid/grid-data/grid-data.component';
import { RetentionStyleComponent } from "./components/angular/retention/retention-style/retention-style.component";
import { RetentionDataComponent } from './components/angular/retention/retention-data/retention-data.component';
import { RectangleStyleComponent } from "./components/angular/rectangle/rectangle-style/rectangle-style.component";
import { RectangleDataComponent } from './components/angular/rectangle/rectangle-data/rectangle-data.component';
import { DateStyleComponent } from './components/angular/date/date-style/date-style.component';
import { DateDataComponent } from './components/angular/date/date-data/date-data.component';
import { TabStyleComponent } from './components/angular/tab/tab-style/tab-style.component';
import { TabDataComponent } from './components/angular/tab/tab-data/tab-data.component';
import { TitleStyleComponent } from './components/angular/title/title-style/title-style.component';
import { TitleDataComponent } from './components/angular/title/title-data/title-data.component';
import { TableStyleComponent } from './components/angular/table/table-style/table-style.component';
import { TableDataComponent } from './components/angular/table/table-data/table-data.component';
import { TextStyleComponent } from './components/angular/text/text-style/text-style.component';
import { TextDataComponent } from './components/angular/text/text-data/text-data.component';
import { AreaStyleComponent } from './components/angular/area/area-style/area-style.component';
import { AreaDataComponent } from './components/angular/area/area-data/area-data.component';
import { StatisticsStyleComponent } from "./components/angular/statistics/statistics-style/statistics-style.component";
import { StatisticsDataComponent } from './components/angular/statistics/statistics-data/statistics-data.component';
import { MapStyleComponent } from "./components/angular/map/map-style/map-style.component";
import { MapDataComponent } from './components/angular/map/map-data/map-data.component';
import { FiltersStyleComponent } from './components/angular/filters/filters-style/filters-style.component';
import { FiltersDataComponent } from './components/angular/filters/filters-data/filters-data.component';
import { DayWeekMonthStyleComponent } from './components/angular/dayWeekMonth/dayWeekMonth-style/dayWeekMonth-style.component';
import { DayWeekMonthDataComponent } from './components/angular/dayWeekMonth/dayWeekMonth-data/dayWeekMonth-data.component';
import { EventImpactStyleComponent } from './components/angular/eventImpact/eventImpact-style/eventImpact-style.component';
import { EventImpactDataComponent } from './components/angular/eventImpact/eventImpact-data/eventImpact-data.component';
import { customfiltersStyleComponent } from './components/angular/customfilters/customfilters-style/customfilters-style.component';
import { customfiltersDataComponent } from './components/angular/customfilters/customfilters-data/customfilters-data.component';
import { VerticalLayoutStyleComponent } from './components/angular/verticalLayout/vertical-layout-style/vertical-layout-style.component';
import { HorizontalLayoutStyleComponent} from './components/angular/horizontalLayout/horizontal-layout-style/horizontal-layout-style.component';

export const componentList: any = [
    {
        type: 'horizontal_layout_container',
        component: HorizontalLayoutComponent,
        styleConfig: HorizontalLayoutStyleComponent,
        dataConfig: null
    },
    {
        type: 'vertical_layout_container',
        component: VerticalLayoutComponent,
        styleConfig: VerticalLayoutStyleComponent,
        dataConfig: null
    },
    {
        type: 'pie',
        component: MyPieComponent,
        styleConfig: PieStyleComponent,
        dataConfig: PieDataComponent
    }, {
        type: 'line',
        component: MyLineComponent,
        styleConfig: LineStyleComponent,
        dataConfig: LineDataComponent
    }, {
        type: 'funnel',
        component: MyFunnelComponent,
        styleConfig: FunnelStyleComponent,
        dataConfig: FunnelDataComponent
    }, {
        type: 'bar',
        component: MyBarComponent,
        styleConfig: BarStyleComponent,
        dataConfig: BarDataComponent
    },
    {
        type: 'grid',
        component: MygridComponent,
        styleConfig: GridStyleComponent,
        dataConfig: GridDataComponent
    },
    {
        type: 'table',
        component: MyTableComponent,
        styleConfig: TableStyleComponent,
        dataConfig: TableDataComponent
    },
    {
        type: 'retention',
        component: MyretentionComponent,
        styleConfig: RetentionStyleComponent,
        dataConfig: RetentionDataComponent
    }, {
        type: 'rectangle',
        component: MyrectangleComponent,
        styleConfig: RectangleStyleComponent,
        dataConfig: null
    },
    {
        type: 'select',
        component: MyselectComponent,
        styleConfig: SelectStyleComponent,
        dataConfig: SelectDataComponent
    }, {
        type: 'date',
        component: MydateComponent,
        styleConfig: DateStyleComponent,
        dataConfig: DateDataComponent
    },
    {
        type: 'tab',
        component: MytabComponent,
        styleConfig: TabStyleComponent,
        dataConfig: TabDataComponent
    },
    {
        type: 'title',
        component: MytitleComponent,
        styleConfig: TitleStyleComponent,
        dataConfig: null
    },
    {
        type: 'filters',
        component: MyfiltersComponent,
        styleConfig: FiltersStyleComponent,
        dataConfig: FiltersDataComponent
    },
    {
        type: 'text',
        component: MyTextComponent,
        styleConfig: TextStyleComponent,
        dataConfig: TextDataComponent
    },{
        type: 'area',
        component: MyAreaComponent,
        styleConfig: AreaStyleComponent,
        dataConfig: AreaDataComponent
    },
    {
        type: 'statistics',
        component: MyStatisticsComponent,
        styleConfig: StatisticsStyleComponent,
        dataConfig: StatisticsDataComponent
    },
    {
        type: 'map',
        component: MyMapComponent,
        styleConfig: MapStyleComponent,
        dataConfig: MapDataComponent
    },
    {
        type: 'dayWeekMonth',
        component: MyDayWeekMonthComponent,
        styleConfig: DayWeekMonthStyleComponent,
        dataConfig: null
    },
    {
        type: 'eventImpact',
        component: MyeventImpactComponent,
        styleConfig: EventImpactStyleComponent,
        dataConfig: null
    },
    {
        type: 'customfilters',
        component: MycustomfiltersComponent,
        styleConfig: customfiltersStyleComponent,
        dataConfig: customfiltersDataComponent
    }
]
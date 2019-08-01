import {AreaComponent} from "./area/area.component";
import {BannerComponent} from "./banner/banner.component";
import {BarComponent} from "./bar/bar.component";
import {BarXyComponent} from './barXy/barXy.component';
import {CellsFilterComponent} from './cellsFilter/cellsFilter.component';
import {ChinaMapComponent} from "./chinamap/chinamap.component";
import {CircleComponent} from "./circle/circle.component";
import {CityFilterComponent} from './cityFilter/cityFilter.component';
import {CityHorizontalBarComponent} from "./cityHorizontalBar/cityHorizontalBar.component";
import {CityPreviewComponent} from './cityPreview/cityPreview.component';
import {DatasourceComponent} from './datasource/datasource.component';
import {DateformatComponent} from './dateformat/dateformat.component';
import {DayCalendarFilterComponent} from './DayCalendarFilter/dayCalendarFilter.component';
import {FilterComponent} from './filter/filter.component';
import {FirstCityFilterComponent} from './firstCityFilter/firstCityFilter.component';
import {FontComponent} from "./font/font.component";
import {FunnelComponent} from './funnel/funnel.component';
import {IndexPriviewComponent} from './indexPriview/indexPriview.component'
import {LifeCycleListComponent} from "./lifeCycleList/lifeCycleList.component";
import {LineBarComponent} from './lineBar/lineBar.component';
import {LineComponent} from "./line/line.component";
import {LinkCommonComponent} from './linkCommon/linkCommon.component';
import {ManyFilterBarComponent} from './manyFilterBar/manyFilterBar.component';
import {MonthCalendarFilterComponent} from './MonthCalendarFilter/monthCalendarFilter.component';
import {OverallFilterComponent} from './overallFilter/overallFilter.component';
import {PartComponent} from './part/part.component'
import {PartnerFilterComponent} from './partnerFilter/partnerFilter.component';
import {PassengerFlowPriviewComponent} from './passengerFlowPriview/passengerFlowPriview.component';
import {PieBarComponent} from './pieBar/PieBar.component';
import {PieComponent} from "./pie/pie.component";
import {PriviewComponent} from "./priview/priview.component";
import {ProvinceFilterComponent} from './provinceFilter/provinceFilter.component';
import {Radar2Component} from './radar2/radar2.component';
import {RadarComponent} from './radar/radar.component';
import {RectFunnelComponent} from './rectFunnel/rectFunnel.component';
import {RFMFilterComponent} from './rfmFilter/rfmFilter.component';
import {ScatterComponent} from './scatter/scatter.component';
import {SelectedLineComponent} from "./selectLine/selectLine.component";
import {SelectFilterComponent} from './selectFilter/selectFilter.component';
import {SingleCalendarFilterComponent} from './SingleCalendarFilter/singleCalendarFilter.component';
import {StackedBarComponent} from './stackedBar/stackedBar.component';
import {StoreHeatmapComponent} from './storeHeatmap/storeHeatmap.component';
import {StripComponent} from "./strip/strip.component";
import {TabAreaComponent} from "./tabArea/tabArea.component";
import {TabFilterComponent} from './tabFilter/tabFilter.component';
import {TableComponent} from "./table/table.component";
import {TabOptionsComponent} from './tabOptions/tabOptions.component';
import {UploadComponent} from './upload/upload.component';

/**t
 * Created by wangshouyun on 09/05/2017.
 */

export class BaseComponentList {
    public static getComponentByType(chartType: string): any {

        switch (chartType) {

            case "1":
                return new FontComponent();
            case "2":
                return new TableComponent();
            case "3":
                return new UploadComponent();
            case "4":
                return new PieComponent();
            case "5":
                return new BarComponent();
            case "6":
                return new LineComponent();
            case "7":
                return new StripComponent();
            case "8":
                return new DateformatComponent();
            case "9":
                return new ChinaMapComponent();
            case "10":
                return new AreaComponent();
            case "11":
                return new PriviewComponent();
            case "12":
                return new BannerComponent();
            case "13":
                return new CircleComponent();
            case "14":
                return new RectFunnelComponent();
            case "15":
                return new StackedBarComponent();
            case "16":
                return new ScatterComponent();
            case "17":
                return new SelectedLineComponent();
            case "18":
                return new Radar2Component();
            case "19":
                return new PartComponent();
            case "20":
                return new BarXyComponent();
            case '21':
                return new FirstCityFilterComponent();
            case "22":
                return new DatasourceComponent();
            case '23':
                return new PartnerFilterComponent();
            case "24":
                return new TabFilterComponent();
            case "25":
                return new OverallFilterComponent();
            case "26":
                return new FunnelComponent();
            case "27":
                return new RadarComponent();
            case "28":
                return new FilterComponent();
            case "29":
                return new CityPreviewComponent();
            case "30":
                return new IndexPriviewComponent();
            case "31":
                return new PassengerFlowPriviewComponent();
            case "32":
                return new ManyFilterBarComponent();
            case "33":
                return new StoreHeatmapComponent();
            case "34":
                return new LinkCommonComponent();
            case '35':
                return new CellsFilterComponent();
            case "36":
                return new CityFilterComponent();
            case '37':
                return new ProvinceFilterComponent();

            case '38':
                return new LineBarComponent();
            case '39':
                return new RFMFilterComponent();
            case '40':
                return new PieBarComponent();
            case '41':
                return new SelectFilterComponent();
            case '42':
                return new DayCalendarFilterComponent();
            case '43':
                return new MonthCalendarFilterComponent();
            case '44':
                return new SingleCalendarFilterComponent();
            case '45':
                return new TabOptionsComponent();
            case '46':
                return new TabAreaComponent();
            case '47':
                return new LifeCycleListComponent();

            case '48':
                return new CityHorizontalBarComponent();

        }
        return null;
    }
}

import {PieComponent} from "./pie/pie.component";
import {LineComponent} from "./line/line.component";
import {BarComponent} from "./bar/bar.component";
import {AreaComponent} from "./area/area.component";
import {StripComponent} from "./strip/strip.component";
import {ChinaMapComponent} from "./chinamap/chinamap.component";
import {BannerComponent} from "./banner/banner.component";
import {CircleComponent} from "./circle/circle.component";
import {PriviewComponent} from "./priview/priview.component";
import {FontComponent} from "./font/font.component";
import {TableComponent} from "./table/table.component";
import {PartComponent} from './part/part.component'
import {IndexPriviewComponent} from './indexPriview/indexPriview.component'
import {DateformatComponent} from './dateformat/dateformat.component';
import {FunnelComponent} from './funnel/funnel.component';
import {RadarComponent} from './radar/radar.component';
import {TestComponent} from './test/test.component';
import {UploadComponent} from './upload/upload.component';
import {ScatterComponent} from './scatter/scatter.component';
import {StackedBarComponent} from './stackedBar/stackedBar.component';
import {SelectedLineComponent} from "./selectLine/selectLine.component";
import {targetTableComponent} from './targetTable/targetTable.component';

import { FilterComponent } from './filter/filter.component';
/**
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
                return new PartComponent();
            case "15":
                return new StackedBarComponent();
            case "17":
                return new SelectedLineComponent();
            case "20":
                return new targetTableComponent();
            case "30":
                return new IndexPriviewComponent();

            case "Area":
                return new AreaComponent();
            case "Banner":
                return new BannerComponent();
            case "Bar":
                return new BarComponent();
            case "ChinaMap":
                return new ChinaMapComponent();
            case "Circle":
                return new CircleComponent();
            case "Dateformat":
                return new DateformatComponent();

            case "Font":
                return new FontComponent();
            case "Funnel":
                return new FunnelComponent();
            case "Line":
                return new LineComponent();
            case "Pie":
                return new PieComponent();
            case "Priview":
                return new PriviewComponent();

            case "Radar":
                return new RadarComponent();
            case "Strip":
                return new StripComponent();
            case "Table":
                return new TableComponent();
            case "Test":
                return new TestComponent();
            case "Upload":
                return new UploadComponent();
            case "16":
                return new ScatterComponent();
            case "Filter":
                return new FilterComponent();
            case "StackedBar":
                return new StackedBarComponent();

        }
        return null;
    }
}



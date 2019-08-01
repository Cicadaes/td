import { ReportConfigService } from "../../../service/report-config.service";
import { LineDataGraph } from "../line/line-data/line-data.graph";
import { EventEmitter, EventType } from "cosmos-td-sdk";
import { BarDataGraph } from "../bar/bar-data/bar-data.graph";
import { PieDataGraph } from "../pie/pie-data/pie-data.graph";
import { FunnelDataGraph } from "../funnel/funnel-data/funnel-data.graph";
import { TableDataGraph } from "../table/table-data/table-data.graph";
import { RetentionDataGraph } from "../retention/retention-data/retention-data.graph";
import { StatisticsDataGraph } from "../statistics/statistics-data/statistics-data.graph";
import { MapDataGraph } from "../map/map-data/map-data.graph";
import { AreaDataGraph } from "../area/area-data/area-data.graph";

export class SwitchRequestGraph {
    constructor(
        type: string = "line",
        obj: any,
        private reportConfigService: ReportConfigService
    ) {
        this.queryData(type, obj);
    }

    queryData(type: string, obj: any) {
        switch (type) {
            case "line":
                new LineDataGraph(this.reportConfigService, obj);
                break;
            case "bar":
                new BarDataGraph(this.reportConfigService, obj);
                break;
            case "pie":
                new PieDataGraph(this.reportConfigService, obj);
                break;
            case "funnel":
                new FunnelDataGraph(this.reportConfigService, obj);
                break;
            case "table":
                new TableDataGraph(this.reportConfigService, obj);
                break;
            case "statistics":
                new StatisticsDataGraph(this.reportConfigService, obj);
                break;
            case "map":
                new MapDataGraph(this.reportConfigService, obj);
                break;
            case "retention":
                new RetentionDataGraph(this.reportConfigService, obj);
                break;
            case "area":
                new AreaDataGraph(this.reportConfigService, obj);
            break;
        
            default:
                break;
        }
    }
}
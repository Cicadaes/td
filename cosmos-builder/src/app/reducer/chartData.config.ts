import { StoreModule, ActionReducer, Action } from 'ng-cosmos-td-common';
import { ChartDataCommunicationService } from '../service/chart-data.communication.service';

export function chartDataReducer(chartData: any = new ChartDataCommunicationService().chartData, action: Action) {
    if(chartData){
        return chartData[action["scopId"]];
    }
}
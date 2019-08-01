import { Component } from '@angular/core';
// import { MarketingCommunicationService } from "../../../../services/marketing/marketing.communication.service";
import {SelectItem} from "primeng/components/common/api";

@Component({
    selector: 'internet-monitor-marketing',
    templateUrl: 'internet-monitor.component.html',
    styleUrls: ['internet-push.component.css'],
    providers: [
        // MarketingCommunicationService
    ]
})
export class InternetMonitorComponent {

    cities: SelectItem[];

    selectedValue: string ="true";

    clickMonitorUrl: string ="点击监测链接";

    exposureMonitor: string = "这是曝光监测";

    constructor() {
        this.cities = [];
        this.cities.push({label:'New York', value:'New York'});
        this.cities.push({label:'Rome', value:'Rome'});
        this.cities.push({label:'London', value:'London'});
        this.cities.push({label:'Istanbul', value:'Istanbul'});
        this.cities.push({label:'Paris', value:'Paris'});
    }

    copySecretKey(){

    }

}
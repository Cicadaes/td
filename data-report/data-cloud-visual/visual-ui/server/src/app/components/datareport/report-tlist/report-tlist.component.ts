import {Component, OnInit,Input} from '@angular/core';
import {Router} from "@angular/router";
import {ReportPublishingCommunicationService} from "../../../services/report-service/reportpublishing.service";



@Component({
    selector:'report-tlist',
    templateUrl:'report-tlist.component.html'
})


export class DatareportTlistComponent  implements OnInit  {
    @Input() config:any;
    searchText:string;

    constructor(
        private datacauseCommunicationService: ReportPublishingCommunicationService,
        private router: Router){

    }

    ngOnInit() { }


    search() {
        let queryObj = {}
        if (this.searchText) {
            queryObj['name'] = `%${this.searchText.replace(/([%\\_])/g, "\\$1")}%`,
            queryObj['nameOperator'] = "like"
        }
        this.datacauseCommunicationService.setQueryObj(queryObj)
        this.datacauseCommunicationService.changePage(1)
    }

}
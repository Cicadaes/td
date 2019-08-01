import {Component,OnInit,Input} from '@angular/core';
import {DatasourceCommunicationService} from "../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../report-service/datacause.service";


@Component({
    selector:'report-dlist',
    templateUrl:'report-dlist.component.html'
})

export class DatareportDlistComponent  implements OnInit  {
    @Input() config:any;
    searchText:string;

    constructor(
        private datacauseCommunicationService: DatacauseCommunicationService){

    }

    ngOnInit() { 
        
    }

    addDataSourceDialog(project:any){
        project.type = 1;
       this.datacauseCommunicationService.addLayerMission(project);
    }

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
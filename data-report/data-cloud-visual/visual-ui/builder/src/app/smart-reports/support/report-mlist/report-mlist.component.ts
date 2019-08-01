import {Component, OnInit,Input} from '@angular/core';
import {Router} from "@angular/router";
import {DatareportcauseCommunicationService} from "../report-service/datareportcause.service";


@Component({
    selector:'report-mlist',
    templateUrl:'report-mlist.component.html',
    styles:[`
    .datacloud-title{   
        height:45px !important;
        width:100%;
        line-height:45px;

    }
    .datacloud_title b{
        font-weight: bold;
        font-size: 12px;
        color: #464C5B;
    }
    .skin-blue .content .padding-none button{
        width: 96px !important;
        border-radius: 4px !important;
        padding: 0 !important;
    }
    .buttons button{
        width: auto;
        height: 28px;
        border: 1px solid #5697f1;
        border-radius: 2px;
        color: #5697f1;
        background-color: #ffffff;
        font-family: "Microsoft YaHei";
        font-size: 12px;
        cursor: pointer;
        transition: background linear 0.3s;
        padding: 1px 15px;
        margin-right: 12px;
    }
  
        
    `]
})

export class DatareportMlistComponent  implements OnInit  {
    searchText:string;
    @Input() config:any;

    constructor(
        private datacauseCommunicationService: DatareportcauseCommunicationService,
        private router: Router){
    }

    ngOnInit() { }

    addDataSourceDialog(){
        let project = {
            type : 1
        };
        console.log(project)
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
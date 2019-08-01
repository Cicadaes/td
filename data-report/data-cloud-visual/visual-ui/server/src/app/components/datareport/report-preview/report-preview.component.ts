import {Component,OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
    selector:'report-preview',
    templateUrl:'report-preview.component.html',
    styleUrls: ['report-preview.component.css']
})

export class DatareportPreviewBoxComponent  implements OnInit  {
    searchText:string;
    reporttype:any;
    config: any = {
        status: 1,
        data: {
            backUrl: '',
            reportName:'',
            reportId: 0
        }
    };

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router){
        this.activatedRoute.params.subscribe((data:any)=>{
            this.config.data.reportId = parseInt(data.reportID);
            this.reporttype = this.router.url.substring(this.router.url.lastIndexOf("/") + 1);
            if(this.reporttype == 0){
                this.config.data.backUrl = "/" + process.env.DIST + '/datareport/reportAlist';
            }
            if(this.reporttype == 1){
                this.config.data.backUrl = "/" + process.env.DIST + '/datareport/reportList';
            }
            console.log(data,"preview")
        })
    }

    ngOnInit() { }

}
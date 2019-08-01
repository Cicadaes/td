import {Component, Input, OnInit, Output} from '@angular/core';
import {DetailTenantsLicencePageService} from './detail-tenants-licence-page.service';
import {ActivatedRoute, NavigationEnd, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ScrollToTopService } from '../../../../@themes/scroll-service'

@Component({
    selector: 'detail-tenants-licence-page',
    templateUrl: './detail-tenants-licence-page.component.html',
    styleUrls: ['./detail-tenants-licence-page.component.css'],
    providers: [ DetailTenantsLicencePageService ]
})

export class DetailTenantsLicencePageComponent implements OnInit{
    @Input() isEdit: boolean = false;
    functionFieldArray:any[];
    isShowEditLicenceModal:boolean = false;
    isShowLicenceAttributeModal:boolean = false;
    id : number;
    licence : any;
    appAttributeParams : any={};
    _dataSet: any = [];
    currentData :any;

    constructor(private scrollSer: ScrollToTopService, private service:DetailTenantsLicencePageService,private route : ActivatedRoute ) {

    }


    initFunctionFieldArray():void{

    }

    ngOnInit() {
        this.initFunctionFieldArray();
        this.id=this.route.snapshot.params['id'];
        this.appAttributeParams.id = this.id;
        //this.functionFieldArray[1].apiParam.id = this.id;
        this.reflashAppDetail();
        this.reflashLicenceAttribute();
    }


    reflashAppDetail(){
        this.service.getAppPageDetail(this.id).subscribe((data: any) => {
            if(data.success=='200'){
                this.licence=data.result;
            }
        });
    }
    reflashLicenceAttribute(){
        this.service.getLicenceAttribute(this.id).subscribe((data: any) => {
            if(data.success=='200'){
                this._dataSet=data.result;
                this.scrollSer.scrollToTop()
            }
        });
    }



}

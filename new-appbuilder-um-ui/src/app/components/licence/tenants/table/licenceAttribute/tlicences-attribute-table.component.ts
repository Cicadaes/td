import { Component, OnInit, Input, Output, EventEmitter,OnChanges,SimpleChanges } from '@angular/core';
import {TlicencesAttributeTableService} from './tlicences-attribute-table.service';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../../../@themes/scroll-service'

@Component({
    selector: 'tlicences-attribute-table',
    templateUrl: './tlicences-attribute-table.component.html',
    styleUrls: ['./tlicences-attribute-table.component.css']
})

export class TlicencesAttributeTableComponent implements OnInit, OnChanges{
    @Input() queryParams : any;
    @Input() _dataSet: any = [];
    @Output() onSubmit = new EventEmitter<any>();
    @Input() tenantLicence :any;
    @Input() noEdit:boolean;
    isShowAddAppModal:boolean = false;
    currentApp:any;

    _current = 1;
    _pageSize = 10;
    _total = 1;
    _loading = true;
    tenantId :any;
    @Input() licenceId:any;

    constructor(private scrollSer: ScrollToTopService, private service: TlicencesAttributeTableService,private route: ActivatedRoute) {

        this.tenantId =this.route.snapshot.params['tenantId'];
        //alert(this.tenantId);

    }


    changeDataSet(e:any){
        setTimeout(() => {
            this.onSubmit.emit(this._dataSet);
        }, 100);
    }
    reset() {
        this.refreshData(true);
    }

    showAddAppModal(app:any){
        this.currentApp = app;
        this.isShowAddAppModal = true;
    }

    hideAddAppModal(params:any){
        this.isShowAddAppModal = false;
    }

    refreshData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        let params = this.queryParams || {};
        params.licenceId=this.licenceId;
        if(this.licenceId){
            this.service.getTenantsLicencesAttribute( params).then((data: any) => {
                this._loading = false;
                this._dataSet = data.result;
                this.scrollSer.scrollToTop()
                setTimeout(() => {
                    this.onSubmit.emit(this._dataSet);
                }, 100);
            }).catch((err:any)=>{
                console.log(err);
            });
        }

    }


    ngOnChanges(changes: SimpleChanges) {
        if(changes.queryParams){
            this.queryParams = changes.queryParams.currentValue || {};
            this.reset();
        }
        if(changes.licenceId){
            //alert(this.licenceId);
            this.reset();
        }
    }

    ngOnInit() {

    }

}

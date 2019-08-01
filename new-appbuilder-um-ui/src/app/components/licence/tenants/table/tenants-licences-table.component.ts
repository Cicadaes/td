import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TenantsLicencesTableService } from './tenants-licences-table.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../../@themes/scroll-service'

@Component({
  selector: 'tenants-licences-table',
  templateUrl: './tenants-licences-table.component.html',
  styleUrls: ['./tenants-licences-table.component.css']
})

export class TenantsLicencesTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  isShowAddAppModal: boolean = false;
  currentApp: any;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  tenantId: any;
  rolecode: any;

  constructor(private scrollSer: ScrollToTopService, private service: TenantsLicencesTableService, private route: ActivatedRoute) {

    this.tenantId = this.route.snapshot.params['tenantId'];
    //alert(this.tenantId);

  }


  reset() {
    this.refreshData(true);
  }

  showAddAppModal(app: any) {
    this.currentApp = app;
    this.isShowAddAppModal = true;
  }

  hideAddAppModal(params: any) {
    this.isShowAddAppModal = false;
  }

  refreshData(reset = false) {
    this.scrollSer.scrollToTop()
    this.initrole();
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    let params = this.queryParams || {};
    params.page = this._current;
    params.rows = this._pageSize;
    params.tenantId = this.tenantId;

    this.service.getTenantsLicences(params).then((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.list;
    }).catch((err: any) => {
      console.log(err);
    });

  }


  ngOnChanges(changes: SimpleChanges) {
    this.queryParams = changes.queryParams.currentValue || {};
    this.reset();
  }

  ngOnInit() {
    this.rolecode = window['appConfig'].rolecode;
    this.initrole();
  }

  initrole() {
    this.rolecode = window['appConfig'].rolecode;
    if (this.rolecode == "UM_TENANT_ADMIN") {
      this.tenantId = window['appConfig'].tenant.id;
    }
  }
}

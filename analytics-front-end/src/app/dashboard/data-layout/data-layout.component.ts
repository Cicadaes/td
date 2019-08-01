import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Vue from 'vue';
import iView from 'iview';
import * as Dashboard from '../../../assets/vue/Dashboard';

Vue.use(iView);

@Component({
  selector: 'app-data-layout',
  templateUrl: './data-layout.component.html',
  styleUrls: ['./data-layout.component.css']
})
export class DataLayoutComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    // ================
    const DashboardClass = Vue.extend(Dashboard);
    const dashboardIns: any = new DashboardClass().$mount('#vue-attach-point2');
    dashboardIns.$on('delete-layout', (id) => {
      debugger;
    });
    dashboardIns.$on('msg-edit-chart', (query) => {
      debugger;
      this.router.navigate(['dashboard/data-viewer', query]);
    });
    dashboardIns.initParamObj('424165320');

    // ModelBusiness.deleteLayout(id);
    // ModelBusiness.retrieveLayoutList(layoutList => {
    //   this.layoutList = layoutList;
    // });
  }
}

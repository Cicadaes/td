import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Vue from 'vue';
import iView from 'iview';
import * as ChartEditor from '../../../assets/vue/ChartEditor';

Vue.use(iView);

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.css']
})
export class DataViewerComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    // ================
    const layoutId = this.route.snapshot.params['layoutId'] || '';
    const profileId = this.route.snapshot.params['profileId'] || '';

    const ChartEditorClass = Vue.extend(ChartEditor);
    const chartEditorIns: any = new ChartEditorClass().$mount('#vue-attach-point2');
    chartEditorIns.initParamOuter(layoutId, profileId);
  }
}

import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../common/base-component';
@Component({
  selector: 'traffic-sources',
  templateUrl: './traffic-sources.component.html',
  styleUrls: ['./traffic-sources.component.less']
})
export class trafficSourcesComponent extends BaseComponent implements OnInit {
  selectedIndex: any;
  _selectedIndex: any;
  constructor(private injector: Injector) {
    super(injector);
    this._selectedIndex = localStorage.getItem('teafficIndex');
    switch (this._selectedIndex) {
      case 'H5':
        this.selectedIndex = 0;
        break;
      case 'Web':
        this.selectedIndex = 1;
        break;
      case 'App':
        this.selectedIndex = 2;
        break;
      default:
        this.selectedIndex = 0;
        break;
    }
    localStorage.removeItem('teafficIndex');
  }
  ngOnInit() {}
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { trafficSourcesComponent } from './traffic-sources.component';
import { trafficSourcesSdetailsComponent } from './../traffic-sources-sdetails/traffic-sources-sdetails.component';

const appRoutes: Routes = [
  {
    path: '',
    component: trafficSourcesComponent
  },
  {
    path: 'list',
    component: trafficSourcesSdetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class trafficSourcesSdetailsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { subcontractChannelsComponent } from './subcontract-channels.component';
// tslint:disable-next-line
import { SubcontractChannelSdetailsComponent } from '../subcontract-channel-sdetails/subcontract-channel-sdetails.component';

const appRoutes: Routes = [
  {
    path: '',
    component: subcontractChannelsComponent
  },
  {
    path: 'list',
    component: SubcontractChannelSdetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class subcontractChannelsRoutingModule {}

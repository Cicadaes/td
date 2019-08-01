import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketingManageComponent } from './marketing-manage.component';
import { CrowdDimensionalityComponent } from './crowd-dimensionality/crowd-dimensionality.component';
import { IndexConfigComponent } from './index-config/index-config.component';
import { EventConfigComponent } from './event-config/event-config.component';
import { AscribeConfigComponent } from './ascribe-config/ascribe-config.component';

const appRoutes: Routes = [
  {
    path: '',
    component: MarketingManageComponent,
    children: [
      {
        path: '',
        redirectTo: 'crowd-manage',
        pathMatch: 'full'
      },
      {
        path: 'crowd-manage',
        component: CrowdDimensionalityComponent
      },
      {
        path: 'index-manage',
        component: IndexConfigComponent
      },
      {
        path: 'event-manage',
        component: EventConfigComponent
      },
      {
        path: 'ascribe-manage',
        component: AscribeConfigComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class MarketingManageRoutingModule {}

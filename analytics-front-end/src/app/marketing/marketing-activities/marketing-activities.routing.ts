import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketingActivitiesComponent } from './marketing-activities.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'activities',
    pathMatch: 'full'
  },
  {
    path: 'activities',
    component: MarketingActivitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class MarketingActivitiesRoutingModule {}

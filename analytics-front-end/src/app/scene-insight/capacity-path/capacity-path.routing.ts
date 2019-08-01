import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapacityPathAddComponent } from './capacity-path-add/capacity-path-add.component';
import { CapacityPathDetailComponent } from './capacity-path-detail/capacity-path-detail.component';
import { CapacityPathComponent } from './capacity-path.component';

const appRoutes: Routes = [
  {
    path: '',
    component: CapacityPathComponent
  },
  {
    path: 'add',
    component: CapacityPathAddComponent
  },
  {
    path: 'edit',
    component: CapacityPathAddComponent
  },
  {
    path: 'view',
    component: CapacityPathDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CapacityPathRoutingModule {}

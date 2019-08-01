import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrowdCreateFormComponent } from './crowd-create-form/crowd-create-form.component';
import { CrowdCreateViewComponent } from './crowd-create-view/crowd-create-view.component';

const appRoutes: Routes = [
  {
    path: 'add',
    component: CrowdCreateFormComponent
  },
  {
    path: 'createChild',
    component: CrowdCreateFormComponent
  },
  {
    path: 'edit',
    component: CrowdCreateFormComponent
  },
  {
    path: 'view',
    component: CrowdCreateViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CrowdCreateRoutingModule {}

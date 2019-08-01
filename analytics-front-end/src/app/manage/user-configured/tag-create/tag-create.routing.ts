import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagCreateFormComponent } from './tag-create-form/tag-create-form.component';
import { TagCreateViewComponent } from './tag-create-view/tag-create-view.component';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'add'
  },
  {
    path: 'add',
    component: TagCreateFormComponent
  },
  {
    path: 'createChild',
    component: TagCreateFormComponent
  },
  {
    path: 'edit',
    component: TagCreateFormComponent
  },
  {
    path: 'view',
    component: TagCreateViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class TagCreateRoutingModule {}

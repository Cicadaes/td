import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInsightComponent } from './user-insight.component';
import { UserListComponent } from './user-list/user-list.component';

const appRoutes: Routes = [
  {
    path: '',
    component: UserInsightComponent
  },
  {
    path: 'list',
    component: UserListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class UserInsightRoutingModule {}

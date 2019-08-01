import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserConfiguredCrowdComponent } from './user-configured-crowd/user-configured-crowd.component';
import { UserConfiguredInsightComponent } from './user-configured-insight/user-configured-insight.component';
import { UserConfiguredTagComponent } from './user-configured-tag/user-configured-tag.component';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'crowd'
  },
  {
    // 用户分群配置
    path: 'crowd',
    component: UserConfiguredCrowdComponent
  },
  {
    // 用户洞察配置
    path: 'insight',
    component: UserConfiguredInsightComponent
  },
  {
    // 用户标签配置
    path: 'tag',
    component: UserConfiguredTagComponent
  },
  {
    path: 'tag/tag-create',
    loadChildren: './tag-create/tag-create.module#TagCreateModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class UserConfiguredRoutingModule {}

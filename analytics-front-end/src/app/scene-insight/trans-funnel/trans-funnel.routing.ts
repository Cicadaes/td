import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunnelAddComponent } from './funnel-add/funnel-add.component';
import { FunnelSeeComponent } from './funnel-see/funnel-see.component';
import { TransFunnelComponent } from './trans-funnel.component';
const appRoutes: Routes = [
  {
    path: '',
    component: TransFunnelComponent
  },
  {
    path: 'add', // 新建
    component: FunnelAddComponent
  },
  {
    path: 'edit', // 编辑
    component: FunnelAddComponent
  },
  {
    path: 'view', // 查看
    component: FunnelSeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class TransFunnelRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataLayoutComponent } from './data-layout/data-layout.component';
import { DataViewerComponent } from './data-viewer/data-viewer.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'data-layout',
    pathMatch: 'full'
  },
  {
    path: 'data-layout',
    component: DataLayoutComponent
  },
  {
    path: 'data-viewer',
    component: DataViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}

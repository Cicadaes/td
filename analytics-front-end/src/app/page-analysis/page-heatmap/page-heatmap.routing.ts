import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageHeatmapComponent } from './page-heatmap.component';
import { PageHeatmapH5Component } from './page-heatmap-h5/page-heatmap-h5.component';
import { PageHeatmapWebComponent } from './page-heatmap-web/page-heatmap-web.component';

const appRoutes: Routes = [
  {
    path: '',
    component: PageHeatmapComponent,
    children: [
      {
        path: '',
        redirectTo: 'page-heatmap-h5',
        pathMatch: 'full'
      },
      {
        path: 'page-heatmap-h5',
        component: PageHeatmapH5Component
      },
      {
        path: 'page-heatmap-web',
        component: PageHeatmapWebComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class PageHeatmapRoutingModule {}

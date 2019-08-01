import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagePathComponent } from './page-path.component';
import { PagePathH5Component } from './page-path-h5/page-path-h5.component';
import { PagePathWebComponent } from './page-path-web/page-path-web.component';
import { PagePathAppComponent } from './page-path-app/page-path-app.component';
import { PagePathMiniProgramComponent } from './page-path-mini-program/page-path-mini-program.component';

const appRoutes: Routes = [
  {
    path: '',
    component: PagePathComponent,
    children: [
      {
        path: '',
        redirectTo: 'page-path-app',
        pathMatch: 'full'
      },
      {
        path: 'page-path-app',
        component: PagePathAppComponent
      },
      {
        path: 'page-path-h5',
        component: PagePathH5Component
      },
      {
        path: 'page-path-web',
        component: PagePathWebComponent
      },
      {
        path: 'page-path-mini-program',
        component: PagePathMiniProgramComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class PagePathRoutingModule {}

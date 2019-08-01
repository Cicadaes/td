import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import Routing_config
import { ROOT_ROUTES } from './router';

// import Component
import { EntryContainerComponent } from './container/entry/entry-container.component';

export const routes: any = [ // 根路由配置信息
  { path: '', pathMatch: 'full', redirectTo: '/entry' },
  { path: 'entry', component: EntryContainerComponent },
  ...ROOT_ROUTES,
  { path: '**', pathMatch: 'full', redirectTo: '/entry' },
];

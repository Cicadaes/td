import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantusersComponent } from './tenantusers.component';

const routes: Routes = [
  {
    path: '',
    component: TenantusersComponent
  }, {
    path: 'addTenantUserPage',
    data: { title: '新增用户', innerMenu: true },
    loadChildren: './page/add-tenantuser-page.module#AddTenantuserPageModule'
  }, {
    path: 'updateTenantUserPage/:id/:tenantId',
    data: { title: '修改用户', innerMenu: true },
    loadChildren: './page/add-tenantuser-page.module#AddTenantuserPageModule'
  }, {
    path: 'viewTenantUserPage/:id',
    data: { title: '查看详情', innerMenu: true },
    loadChildren: './view/detail-tenantuser-page.module#DetailTenantUserPageModule'
  }, {
    path: 'addTenantUserPage2',
    data: { title: '添加用户', innerMenu: true },
    loadChildren: './page/add-tenantuser-page.module#AddTenantuserPageModule'
  }, {
    path: 'updateTenantUserPage2/:id',
    data: { title: '修改用户', innerMenu: true },
    loadChildren: './page/add-tenantuser-page.module#AddTenantuserPageModule'
  }, {
    path: 'viewTenantUserPage2/:id',
    data: { title: '查看详情', innerMenu: true },
    loadChildren: './view/detail-tenantuser-page.module#DetailTenantUserPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class TenantusersRoutingModule { }

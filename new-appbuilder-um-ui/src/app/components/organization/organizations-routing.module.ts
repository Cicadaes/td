import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';
const routes: Routes = [
    {
        path: '',
        component: OrganizationsComponent
    },
    {
        path: 'viewTenantUserPage/:id',
        data: { title: '查看详情', innerMenu: true },
        loadChildren: '../tenantuser/view/detail-tenantuser-page.module#DetailTenantUserPageModule'
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

export class OrganizationsRoutingModule { }
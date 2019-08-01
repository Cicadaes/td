import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsLicencesComponent } from './tenants-licences.component';
import {DetailTenantLicenceModule} from "./detail/detail-tenant-licence.module";

const routes: Routes = [
    {
        path: '',
        component: TenantsLicencesComponent
    },{
        path: 'addTenantLicence',
        data: { title: '添加许可证',innerMenu:true},
        loadChildren: './add/add-tenant-licence.module#AddTenantLicenceModule'
    },{
        path: 'editTenantLicence/:id',
        data: { title: '编辑许可证' },
        loadChildren: './edit/edit-tenant-licence.module#EditTenantLicenceModule'
    },{
        path: 'detailTenantLicence/:id',
        data: { title: '许可证详情' },
        loadChildren: './detail/detail-tenant-licence.module#DetailTenantLicenceModule'
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

export class TenantsLicencesRoutingModule { }
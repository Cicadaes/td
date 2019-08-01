import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicencesComponent } from './licences.component';
import {AddTenantLicenceModule} from "./tenants/add/add-tenant-licence.module";

const routes: Routes = [
    {
        path: '',
        component: LicencesComponent
    },{
        path: 'addLicencePage',
        data: { title: '新建许可证',url:'/licences/addLicencePage' },
        loadChildren: './page/add-licence-page.module#AddLicencePageModule'
    },{
        path: 'detailLicencePage/:id',
        data: { title: '许可证详情' },
        loadChildren: './detailLicence/detail-licence-page.module#DetailLicencePageModule'
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

export class LicencesRoutingModule { }
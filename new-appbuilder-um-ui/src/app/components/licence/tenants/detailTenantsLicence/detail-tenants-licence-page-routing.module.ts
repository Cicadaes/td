import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailTenantsLicencePageComponent } from './detail-tenants-licence-page.component';

const routes: Routes = [
    {
        path: '',
        component: DetailTenantsLicencePageComponent
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

export class DetailTenantsLicencePageRoutingModule { }
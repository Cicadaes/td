import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowOrganizationPageComponent } from './show-organization-page.component';

const routes: Routes = [
    {
        path: '',
        component: ShowOrganizationPageComponent
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

export class ShowOrganizationPageRoutingModule { }

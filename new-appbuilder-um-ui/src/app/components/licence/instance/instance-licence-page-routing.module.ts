import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstanceLicencePageComponent } from './instance-licence-page.component';

const routes: Routes = [
    {
        path: '',
        component: InstanceLicencePageComponent
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

export class InstanceLicencePageRoutingModule { }
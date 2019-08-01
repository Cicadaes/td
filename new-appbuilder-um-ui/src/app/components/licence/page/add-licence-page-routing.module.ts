import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLicencePageComponent } from './add-licence-page.component';

const routes: Routes = [
    {
        path: '',
        component: AddLicencePageComponent
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

export class AddLicencePageRoutingModule { }
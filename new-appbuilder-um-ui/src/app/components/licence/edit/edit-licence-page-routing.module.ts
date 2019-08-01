import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditLicencePageComponent } from './edit-licence-page.component';

const routes: Routes = [
    {
        path: '',
        component: EditLicencePageComponent
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

export class EditLicencePageRoutingModule { }
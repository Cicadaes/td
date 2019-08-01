import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTenantuserPageComponent } from './add-tenantuser-page.component';

const routes: Routes = [
    {
        path: '',
        component: AddTenantuserPageComponent
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

export class AddTenantuserPageRoutingModule { }
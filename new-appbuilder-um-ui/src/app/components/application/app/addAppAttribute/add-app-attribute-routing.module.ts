import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAppAttributeComponent } from './add-app-attribute.component';

const routes: Routes = [
    {
        path: '',
        component: AddAppAttributeComponent
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

export class AddAppAttributeRoutingModule { }
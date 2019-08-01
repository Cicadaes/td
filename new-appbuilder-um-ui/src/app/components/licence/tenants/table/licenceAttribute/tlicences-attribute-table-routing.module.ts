import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TlicencesAttributeTableComponent} from './tlicences-attribute-table.component';

const routes: Routes = [
    {
        path: '',
        component: TlicencesAttributeTableComponent
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

export class TlicencesAttributeTableRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddActionPageComponent } from './add-action-page.component';
import {AddActionPageModule} from "./add-action-page.module";

const routes: Routes = [
    {
        path: '',
        component: AddActionPageComponent
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

export class AddActionPageRoutingModule { }
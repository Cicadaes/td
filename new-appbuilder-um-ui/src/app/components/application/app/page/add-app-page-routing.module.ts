import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAppPageComponent } from './add-app-page.component';
import {AddAppPageModule} from "./add-app-page.module";

const routes: Routes = [
    {
        path: '',
        component: AddAppPageComponent
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

export class AddAppPageRoutingModule { }
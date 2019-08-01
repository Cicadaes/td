import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FunctionTableComponent} from "./function-table.component";


const routes: Routes = [
    {
        path: '',
        component: FunctionTableComponent
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

export class FunctionTableRoutingModule { }
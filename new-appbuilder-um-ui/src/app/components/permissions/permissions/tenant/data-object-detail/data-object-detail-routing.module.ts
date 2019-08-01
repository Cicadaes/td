import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataObjectDetailComponent } from './data-object-detail.component';

const routes: Routes = [
    {
        path: '',
        component: DataObjectDetailComponent
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

export class DataObjectDetailRoutingModule { }
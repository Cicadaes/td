import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppTableComponent } from './app-table.component';

const routes: Routes = [
    {
        path: '',
        component: AppTableComponent
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

export class AppTableRoutingModule { }

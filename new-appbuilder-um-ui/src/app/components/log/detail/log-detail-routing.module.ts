import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogDetailComponent } from './log-detail.component';

const routes: Routes = [
    {
        path: '',
        component: LogDetailComponent
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

export class LogDetailRoutingModule { }
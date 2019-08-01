import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckLicenceDialogComponent } from './check-licence-dialog.component';

const routes: Routes = [
    {
        path: '',
        component: CheckLicenceDialogComponent
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

export class CheckLicenceDialogRoutingModule { }
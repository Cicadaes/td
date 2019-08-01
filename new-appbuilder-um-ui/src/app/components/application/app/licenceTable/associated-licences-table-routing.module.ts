import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssociatedLicencesTableComponent } from './associated-licences-table.component';

const routes: Routes = [
    {
        path: '',
        component: AssociatedLicencesTableComponent
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

export class AssociatedLicencesTableRoutingModule { }
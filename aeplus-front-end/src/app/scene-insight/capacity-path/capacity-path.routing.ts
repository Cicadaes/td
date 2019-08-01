import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CapacityPathTableComponent} from './capacity-path-table/capacity-path-table.component';
import {CapacityPathAddComponent} from './capacity-path-add/capacity-path-add.component';
import {CapacityPathDetailComponent} from './capacity-path-detail/capacity-path-detail.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path: 'list',
        component: CapacityPathTableComponent,
    },
    {
        path: 'add',
        component: CapacityPathAddComponent,
    },
    {
        path: 'edit',
        component: CapacityPathAddComponent,
    },
    {
        path: 'view',
        component: CapacityPathDetailComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class CapacityPathRoutingModule {
}

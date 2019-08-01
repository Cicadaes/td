import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdvancedTransFunnelTableComponent} from './table/advanced-trans-funnel-table/advanced-trans-funnel-table.component';
import {AdvancedTransFunnelAddPageComponent} from './page/advanced-trans-funnel-add-page/advanced-trans-funnel-add-page.component';
import {AdvancedTransFunnelViewPageComponent} from './page/advanced-trans-funnel-view-page/advanced-trans-funnel-view-page.component';
import {AdvancedTransFunnelUsersPageComponent} from './page/advanced-trans-funnel-users-page/advanced-trans-funnel-users-page.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }, {
        path: 'list',
        component: AdvancedTransFunnelTableComponent
    }, {
        path: 'add',
        component: AdvancedTransFunnelAddPageComponent
    }, {
        path: 'edit',
        component: AdvancedTransFunnelAddPageComponent
    }, {
        path: 'view',
        component: AdvancedTransFunnelViewPageComponent
    }, {
        path: 'users',
        component: AdvancedTransFunnelUsersPageComponent
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
export class AdvancedTransFunnelRoutingModule {

}

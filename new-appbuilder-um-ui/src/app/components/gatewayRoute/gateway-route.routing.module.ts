import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GatewayRouteComponent } from './gateway-route.component';

const routes: Routes = [
    {
        path: '',
        component: GatewayRouteComponent
    },
    {
        path: 'detail/:id',
        data: { title: '路由规则详情' },
        loadChildren: './detail/gateway-route-detail.module#GatewayRouteDetailModule'
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

export class GatewayRouteRoutingModule { }

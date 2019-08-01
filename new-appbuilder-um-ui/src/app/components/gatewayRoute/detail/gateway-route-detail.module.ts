import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { GatewayRouteervice } from '../gateway-route.service';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { RouterModule, Routes } from '@angular/router';
import { GatewayRouteDetailComponent } from './gateway-route-detail.component';

const routes: Routes = [
    {
        path: '',
        component: GatewayRouteDetailComponent
    }
];

@NgModule({
    declarations: [
        GatewayRouteDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        DateFormatPipeModule,
        RouterModule.forChild(routes)
    ],
    providers: [GatewayRouteervice],
    exports: [GatewayRouteDetailComponent]
})
export class GatewayRouteDetailModule { }

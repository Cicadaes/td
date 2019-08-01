import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { SetValueLengthPipeModule } from '../../pipes/setStringLength-pipe';
import { DateFormatPipeModule } from '../../pipes/dateFormat-pipe';
import { GatewayRouteRoutingModule } from './gateway-route.routing.module';
import { GatewayRouteervice } from './gateway-route.service';
import { GatewayRouteComponent } from './gateway-route.component';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddRouteComponent } from './add/add-route.component';

@NgModule({
    declarations: [
        GatewayRouteComponent,
        AddRouteComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        GatewayRouteRoutingModule,
        SetValueLengthPipeModule,
        DateFormatPipeModule,
        MoreSearchModule
    ],
    providers: [GatewayRouteervice],
    exports: [GatewayRouteComponent]
})
export class GatewayRouteModule { }

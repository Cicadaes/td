import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { SetValueLengthPipeModule } from '../../pipes/setStringLength-pipe';
import { DateFormatPipeModule } from '../../pipes/dateFormat-pipe';
import { ApiAccountService } from './api-account.service';
import { ApiAccountComponent } from './api-account.component';
import { ApiAccountRoutingModule } from './api-account.routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddApiAccountComponent } from './add/add-api-account.component';
import { TenantDetailService } from '../tenant/view/tenant-detail.service';
import { OperTableComponent } from './table/oper/oper-table.component';
import { TenantTableComponent } from './table/tenant/tenant-table.component';

@NgModule({
    declarations: [
        ApiAccountComponent,
        AddApiAccountComponent,
        OperTableComponent,
        TenantTableComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ApiAccountRoutingModule,
        SetValueLengthPipeModule,
        DateFormatPipeModule,
        MoreSearchModule,
    ],
    providers: [ ApiAccountService, TenantDetailService ],
    exports: [ ApiAccountComponent ]
})
export class ApiAccountModule {

}

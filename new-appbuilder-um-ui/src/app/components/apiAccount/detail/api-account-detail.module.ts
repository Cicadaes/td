import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { RouterModule, Routes } from '@angular/router';
import { ApiAccountDetailComponent } from './api-account-detail.component';
import { ApiAccountService } from '../api-account.service';
import { ApiTenantTableComponent } from './apiTable/tenant/api-tenant-table.component';
import { ApiOperTableComponent } from './apiTable/oper/api-oper-table.component';
import { MoreSearchModule } from 'src/app/main/more-search/more-search.module';
import { AddAutoApiComponent } from './apiAuthTable/add-auto-api.component';

const routes: Routes = [
    {
        path: '',
        component: ApiAccountDetailComponent
    }
];

@NgModule({
    declarations: [
        ApiAccountDetailComponent,
        ApiTenantTableComponent,
        ApiOperTableComponent,
        AddAutoApiComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        MoreSearchModule,
        DateFormatPipeModule,
        RouterModule.forChild(routes)
    ],
    providers: [ApiAccountService],
    exports: [ApiAccountDetailComponent]
})
export class ApiAccountDetailModule { }

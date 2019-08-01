import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantDetailService } from './tenant-detail.service';
import { TenantDetailRoutingModule } from './tenant-detail-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TenantDetailComponent } from './tenant-detail.component';

@NgModule({
    declarations: [
        TenantDetailComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TenantDetailRoutingModule,
        NgZorroAntdModule
    ],
    providers: [TenantDetailService],
    exports: [TenantDetailComponent]
})
export class TenantDetailModule { }

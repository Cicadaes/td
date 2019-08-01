import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TenantLogTableComponent } from './tenant-log-table.component';
import { TenantLogTableService } from './tenant-log-table.service';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        TenantLogTableComponent
    ],
    imports: [
        RouterModule,
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [TenantLogTableService],
    exports: [TenantLogTableComponent]
})
export class TenantLogTableModule {

}

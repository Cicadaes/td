import { LogsRoutingModule } from './logs-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { LogsService } from './logs.service';
import { LogsComponent } from './logs.component';
import {CommonModule} from '@angular/common';
import { TenantLogTableModule } from './tenant-table/tenant-log-table.module';
import { SuperLogTableModule } from './super-table/super-log-table.module';
import {MoreSearchModule} from '../../main/more-search/more-search.module';

@NgModule({
    declarations: [
        LogsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MoreSearchModule,
        TenantLogTableModule,
        SuperLogTableModule,
        LogsRoutingModule,
        NgZorroAntdModule
    ],
    providers: [LogsService],
    exports: [LogsComponent]
})
export class LogsModule {

}

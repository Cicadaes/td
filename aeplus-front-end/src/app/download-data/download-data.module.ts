import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {DownloadDataRoutingModule} from './download-data.routing';
import {DownloadDataComponent} from './download-data.component';
import {DownloadDataTableComponent} from './table/download-data-table/download-data-table.component';
import {DateFormatPipeModule} from '../../pipes/date-format-pipe';
import {CalStatusPipeModule} from '../../pipes/cal-status-pipe';
import {StatusPipeModule} from '../../pipes/status-pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DownloadDataRoutingModule,
        NgZorroAntdModule,
        DateFormatPipeModule,
        CalStatusPipeModule,
        StatusPipeModule,
    ],
    declarations: [
        DownloadDataComponent,
        DownloadDataTableComponent
    ]
})
export class DownloadDataModule {
}


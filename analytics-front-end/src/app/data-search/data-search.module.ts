import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ClipboardModule } from 'ngx-clipboard';
import { DataSearchRoutingModule } from './data-search.routing';
import { DataSearchComponent } from './data-search.component';
import { FastSearchModule } from '../main/fast-search/fast-search.module';
import { ResultTableComponent } from './result-table/result-table.component';
import { HistoryTableComponent } from './history-table/history-table.component';
import { GenerateApiDialogComponent } from './generate-api-dialog/generate-api-dialog.component';
import { GenerateApiFormComponent } from './generate-api-form/generate-api-form.component';
import { TableStructureDialogComponent } from './table-structure-dialog/table-structure-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataSearchRoutingModule,
    NgZorroAntdModule,
    FastSearchModule,
    ClipboardModule
  ],
  declarations: [
    DataSearchComponent,
    ResultTableComponent,
    HistoryTableComponent,
    GenerateApiDialogComponent,
    GenerateApiFormComponent,
    TableStructureDialogComponent
  ]
})
export class DataSearchModule {}

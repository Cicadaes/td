import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { RouterModule } from '@angular/router';
import { AppTableComponent } from './app-table.component';
import { AppTableService } from './app-table.service';
import { AddAppDialogModule } from '../dialog/add-app-dialog.module';
import { AppTableRoutingModule } from './app-table-routing.module';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';

@NgModule({
  declarations: [
    AppTableComponent
  ],
  imports: [
    DateFormatPipeModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AddAppDialogModule,
    AppTableRoutingModule,
    RouterModule,
    NgZorroAntdModule
  ],
  providers: [AppTableService],
  exports: [AppTableComponent]
})
export class AppTableModule {

}

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TenantsAppTableComponent } from './tenants-app-table.component';
import { TenantsAppTableService } from './tenants-app-table.service';
import { TenantsAppTableRoutingModule } from './tenants-app-table-routing.module';
import { AddUserDialogModule } from '../../../../user/dialog/add-user-dialog.module';
import { DetailFuncDialogModule } from '../dialog/detail-func-dialog.module';

@NgModule({
    declarations: [
        TenantsAppTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TenantsAppTableRoutingModule,
        AddUserDialogModule,
        DetailFuncDialogModule,
        NgZorroAntdModule
    ],
    providers: [TenantsAppTableService],
    exports: [TenantsAppTableComponent]
})
export class TenantsAppTableModule {

}

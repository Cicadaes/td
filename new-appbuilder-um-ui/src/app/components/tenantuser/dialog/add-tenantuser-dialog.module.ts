import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddTenantUserDialogService } from './add-tenantuser-dialog.service';
import { AddTenantUserDialogComponent } from './add-tenantuser-dialog.component';
import { CommonModule } from '@angular/common';
import { AddTenantUserFormModule } from '../form/add-tenantuser-form.module';

@NgModule({
    declarations: [
        AddTenantUserDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AddTenantUserFormModule,
        NgZorroAntdModule
    ],
    providers: [AddTenantUserDialogService],
    exports: [AddTenantUserDialogComponent]
})
export class AddTenantUserDialogModule {

}

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddTenantDialogService } from './add-tenant-dialog.service';
import { AddTenantDialogComponent } from './add-tenant-dialog.component';
import { CommonModule } from '@angular/common';
// import { AddTenantFormModule } from '../form/add-tenant-form.module';

@NgModule({
    declarations: [
        AddTenantDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        // AddTenantFormModule,
        NgZorroAntdModule
    ],
    providers: [AddTenantDialogService],
    exports: [AddTenantDialogComponent]
})
export class AddTenantDialogModule {

}

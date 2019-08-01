import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddPermissionsDialogService } from './add-permissions-dialog.service';
import { AddpermissionsDialogComponent } from './add-permissions-dialog.component';
import { CommonModule } from '@angular/common';
import { AddPermissionsFormModule } from '../form/add-permissions-form.module';

@NgModule({
    declarations: [
        AddpermissionsDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AddPermissionsFormModule,
        NgZorroAntdModule
    ],
    providers: [AddPermissionsDialogService],
    exports: [AddpermissionsDialogComponent]
})
export class AddPermissionsDialogModule {

}

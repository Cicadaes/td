import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddRoleDialogService } from './add-role-dialog.service';
import { AddRoleDialogComponent } from './add-role-dialog.component';
import { CommonModule } from '@angular/common';
import { AddRoleFormModule } from '../form/add-role-form.module';

@NgModule({
    declarations: [
        AddRoleDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AddRoleFormModule,
        NgZorroAntdModule
    ],
    providers: [AddRoleDialogService],
    exports: [AddRoleDialogComponent]
})
export class AddRoleDialogModule {

}

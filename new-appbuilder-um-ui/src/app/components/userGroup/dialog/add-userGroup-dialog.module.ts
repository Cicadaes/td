import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUserGroupDialogService } from './add-userGroup-dialog.service';
import { AddUserGroupDialogComponent } from './add-userGroup-dialog.component';
import { CommonModule } from '@angular/common';
import { AddUserGroupFormModule } from '../form/add-userGroup-form.module';

@NgModule({
    declarations: [
        AddUserGroupDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AddUserGroupFormModule,
        NgZorroAntdModule
    ],
    providers: [AddUserGroupDialogService],
    exports: [AddUserGroupDialogComponent]
})
export class AddUserGroupDialogModule {

}

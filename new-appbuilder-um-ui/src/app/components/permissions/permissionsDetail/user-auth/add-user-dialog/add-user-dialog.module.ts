import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AddUserDialogService } from './add-user-dialog.service';
import { AddUserDialogComponent } from './add-user-dialog.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUgUserFormModule } from '../../../../uguser/form/add-uguser-form.module';

@NgModule({
    declarations: [
        AddUserDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        // AddUgUserFormModule,
        NgZorroAntdModule
    ],
    providers: [AddUserDialogService],
    exports: [AddUserDialogComponent]
})
export class AddUserDialogModule {

}

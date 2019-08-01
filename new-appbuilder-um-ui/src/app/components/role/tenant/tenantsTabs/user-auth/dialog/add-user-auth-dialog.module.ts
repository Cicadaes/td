import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUserAuthDialogService } from './add-user-auth-dialog.service';
import { AddUserAuthDialogComponent } from './add-user-auth-dialog.component';
import { CommonModule } from '@angular/common';
import { UserUnauthTableModule } from '../unauth-table/user-unauth-table.module';

@NgModule({
    declarations: [
        AddUserAuthDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        UserUnauthTableModule,
        NgZorroAntdModule
    ],
    providers: [AddUserAuthDialogService],
    exports: [AddUserAuthDialogComponent]
})
export class AddUserAuthDialogModule {

}

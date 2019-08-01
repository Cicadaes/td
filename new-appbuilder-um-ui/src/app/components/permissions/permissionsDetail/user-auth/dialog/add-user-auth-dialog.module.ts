import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AddUserAuthDialogService } from './add-user-auth-dialog.service';
import { AddUserAuthDialogComponent } from './add-user-auth-dialog.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { MoreSearchModule } from '../../../../../main/more-search/more-search.module';
import {AddUserAuthFormModule} from '../form/add-user-auth-form.module';
import {UserUnauthTableModule} from '../unauth-table/user-unauth-table.module';


@NgModule({
    declarations: [
        AddUserAuthDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MoreSearchModule,
        UserUnauthTableModule,
        AddUserAuthFormModule,
        NgZorroAntdModule
    ],
    providers: [AddUserAuthDialogService],
    exports: [AddUserAuthDialogComponent]
})
export class AddUserAuthDialogModule {

}

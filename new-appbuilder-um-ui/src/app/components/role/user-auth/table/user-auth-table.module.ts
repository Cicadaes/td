import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UserAuthTableComponent } from './user-auth-table.component';
import { UserAuthTableService } from './user-auth-table.service';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';
// import {AddUserAuthDialogModule} from '../dialog/add-user-auth-dialog.module';
import { UMThemeModule } from '../../../../@themes/um-theme.module';


@NgModule({
    declarations: [
        UserAuthTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        DateFormatPipeModule,
        FormsModule,
        CommonModule,
        UMThemeModule,
        NgZorroAntdModule
        // AddUserAuthDialogModule,

    ],
    providers: [UserAuthTableService],
    exports: [UserAuthTableComponent]
})
export class UserAuthTableModule {

}

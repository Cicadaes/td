import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAuthTableComponent } from './user-auth-table.component';
import { UserAuthTableService } from './user-auth-table.service';
import { DateFormatPipeModule } from '../../../../../pipes/dateFormat-pipe';
import { UMThemeModule } from '../../../../../@themes/um-theme.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

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

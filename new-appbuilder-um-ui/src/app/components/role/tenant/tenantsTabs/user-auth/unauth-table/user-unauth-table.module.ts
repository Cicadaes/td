import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UserUnauthTableComponent } from './user-unauth-table.component';
import { UserUnauthTableService } from './user-unauth-table.service';
import {DateFormatPipeModule} from '../../../../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        UserUnauthTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        CommonModule,
        NgZorroAntdModule
        // AddUserAuthDialogModule,

    ],
    providers: [UserUnauthTableService],
    exports: [UserUnauthTableComponent]
})
export class UserUnauthTableModule {

}

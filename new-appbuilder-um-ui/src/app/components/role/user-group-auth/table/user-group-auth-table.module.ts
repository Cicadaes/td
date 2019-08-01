import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UserGroupAuthTableComponent } from './user-group-auth-table.component';
import { UserGroupAuthTableService } from './user-group-auth-table.service';
@NgModule({
    declarations: [
        UserGroupAuthTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [UserGroupAuthTableService],
    exports: [UserGroupAuthTableComponent]
})
export class UserGroupAuthTableModule {

}

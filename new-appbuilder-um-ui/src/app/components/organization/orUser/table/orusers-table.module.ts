import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrUsersTableComponent } from './orusers-table.component';
import { OrUsersTableService } from './orusers-table.service';
import { OrUsersTableRoutingModule } from './orusers-table-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        OrUsersTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        OrUsersTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [OrUsersTableService],
    exports: [OrUsersTableComponent]
})
export class OrUsersTableModule { }

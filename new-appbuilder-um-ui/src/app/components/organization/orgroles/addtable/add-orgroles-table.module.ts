import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddOrgRolesTableComponent } from './add-orgroles-table.component';
import { AddOrgRolesTableService } from './add-orgroles-table.service';
import { AddOrgRolesTableRoutingModule } from './add-orgroles-table-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';


@NgModule({
    declarations: [
        AddOrgRolesTableComponent
    ],
    imports: [
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddOrgRolesTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [AddOrgRolesTableService],
    exports: [AddOrgRolesTableComponent]
})
export class AddOrgRolesTableModule { }

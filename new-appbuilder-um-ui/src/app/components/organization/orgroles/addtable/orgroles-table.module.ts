import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgRolesTableComponent } from './orgroles-table.component';
import { OrgRolesTableService } from './orgroles-table.service';
import { OrgRolesTableRoutingModule } from './orgroles-table-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';


@NgModule({
    declarations: [
        OrgRolesTableComponent
    ],
    imports: [
        RouterModule,
        NgZorroAntdModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        OrgRolesTableRoutingModule,
    ],
    providers: [OrgRolesTableService],
    exports: [OrgRolesTableComponent]
})
export class OrgRolesTableModule { }

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UgRolesTableComponent } from './ugroles-table.component';
import { UgRolesTableService } from './ugroles-table.service';
import { UgRolesTableRoutingModule } from './ugroles-table-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';


@NgModule({
    declarations: [
        UgRolesTableComponent
    ],
    imports: [
        RouterModule,
        UgRolesTableRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [UgRolesTableService],
    exports: [UgRolesTableComponent]
})
export class UgRolesTableModule { }

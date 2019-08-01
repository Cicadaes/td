import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUgRolesTableComponent } from './add-ugroles-table.component';
import { AddUgRolesTableService } from './add-ugroles-table.service';
import { AddUgRolesTableRoutingModule } from './add-ugroles-table-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';


@NgModule({
    declarations: [
        AddUgRolesTableComponent
    ],
    imports: [
        RouterModule,
        AddUgRolesTableRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [AddUgRolesTableService],
    exports: [AddUgRolesTableComponent]
})
export class AddUgRolesTableModule { }

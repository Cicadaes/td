import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserGroupFormModule } from '../form/add-userGroup-form.module';
import { DetailUserGroupPageService } from './detail-userGroup-page.service';
import { DetailUserGroupPageComponent } from './detail-userGroup-page.component';
import { DetailUserGroupPageRoutingModule } from './detail-userGroup-page-routing.module';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';
import { UgUsersTableModule } from '../../uguser/table/ugusers-table.module';
import { AddUgUserDialogModule } from '../../uguser/dialog/add-uguser-dialog.module';
import { UgUsersTableDialogModule } from '../../uguser/dialog/ugusers-table-dialog.module';
import { UgRolesTableModule } from '../../ugrole/table/ugroles-table.module';
import { UgRolesTableDialogModule } from '../../ugrole/dialog/ugroles-table-dialog.module';
import { AddUgRolesTableModule } from '../../ugrole/table/add-ugroles-table.module';
import { CarouselAppManageModule } from '../../../main/carousel/carousel-app-manage/carousel-app-manage.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        DetailUserGroupPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        UgUsersTableModule,
        UgUsersTableDialogModule,
        MoreSearchModule,
        CommonModule,
        UgRolesTableDialogModule,
        UgRolesTableModule,
        AddUgRolesTableModule,
        AddUserGroupFormModule,
        DetailUserGroupPageRoutingModule,
        AddUgUserDialogModule,
        CarouselAppManageModule,
        NgZorroAntdModule
    ],
    providers: [ DetailUserGroupPageService ],
    exports: [ DetailUserGroupPageComponent ]
})
export class DetailUserGroupPageModule { }

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { DetailTenantUserPageService } from './detail-tenantuser-page.service';
import { DetailTenantUserPageRoutingModule } from './detail-tenantuser-page-routing.module';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { DetailTenantUserPageComponent } from './detail-tenantuser-page.component';
import { AddTenantUserFormModule } from '../form/add-tenantuser-form.module';
import { AddUgUserGroupDialogModule } from '../../uguserGroup/dialog/uguserGroups-table-dialog.module';
import { UgUserGroupsTableModule } from '../../uguserGroup/table/uguserGroups-table.module';
import { UgRolesTableDialogModule } from '../../ugrole/dialog/ugroles-table-dialog.module';
import { AddUgRolesTableModule } from '../../ugrole/table/add-ugroles-table.module';
import { UgRolesTableModule } from '../../ugrole/table/ugroles-table.module';
import { CarouselAppManageModule } from '../../../main/carousel/carousel-app-manage/carousel-app-manage.module';
import { UMThemeModule } from '../.,/../../../@themes/um-theme.module';

@NgModule({
    declarations: [
        DetailTenantUserPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        DateFormatPipeModule,
        FormsModule,
        CommonModule,
        DetailTenantUserPageRoutingModule,
        UgRolesTableModule,
        AddUgRolesTableModule,
        UgRolesTableDialogModule,
        UgUserGroupsTableModule,
        AddUgUserGroupDialogModule,
        AddTenantUserFormModule,
        CarouselAppManageModule,
        UMThemeModule,
        NgZorroAntdModule
    ],
    providers: [DetailTenantUserPageService],
    exports: [DetailTenantUserPageComponent]
})
export class DetailTenantUserPageModule {

}

import { ShowOrganizationPageRoutingModule } from './show-organization-page-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowOrganizationPageComponent } from './show-organization-page.component';
import { ShowOrganizationPageService } from './show-organization-page.service';
import { SelectSearchModule } from '../../../main/select/select-search/select-search.module';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';
import { UgUsersTableModule } from '../../uguser/table/ugusers-table.module';
import { OrUsersTableModule } from '../orUser/table/orusers-table.module';
import { AddOrgUserDialogModule } from '../orUser/adusers/add-orguser-dialog.module';
import { AddUgUserDialogModule } from '../../uguser/dialog/add-uguser-dialog.module';
import { UgUsersTableDialogModule } from '../../uguser/dialog/ugusers-table-dialog.module';
import { OrgUsersTableDialogModule } from '../orUser/dialog/orgusers-table-dialog.module';
import { OrgRolesTableDialogModule } from '../dialog/orgroles-table-dialog.module';
import { OrgRolesTableModule } from '../orgroles/addtable/orgroles-table.module';
import { CarouselAppManageModule } from '../../../main/carousel/carousel-app-manage/carousel-app-manage.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        ShowOrganizationPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ShowOrganizationPageRoutingModule,
        SelectSearchModule,
        MoreSearchModule,
        UgUsersTableModule,
        OrUsersTableModule,
        AddOrgUserDialogModule,
        AddUgUserDialogModule,
        UgUsersTableDialogModule,
        OrgUsersTableDialogModule,
        OrgRolesTableDialogModule,
        OrgRolesTableModule,
        CarouselAppManageModule,
        NgZorroAntdModule
    ],
    providers: [ShowOrganizationPageService],
    exports: [ShowOrganizationPageComponent]
})
export class ShowOrganizationPageModule { }

import { OrganizationsRoutingModule } from './organizations-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { OrganizationsService } from './organizations.service';
import { OrganizationsComponent } from './organizations.component';
import { CommonModule } from '@angular/common';
import { AddOrganizationDialogModule } from './addOrganization/add-organization-dialog.module';
import { LicencesModule } from '../licence/licences.module';
import { ShowOrganizationPageModule } from './showOrganization/show-organization-page.module';
import { OrganizationTreeModule } from '../../main/tree/organization-tree/organization-tree.module';
@NgModule({
    declarations: [
        OrganizationsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        OrganizationsRoutingModule,
        AddOrganizationDialogModule,
        LicencesModule,
        ShowOrganizationPageModule,
        OrganizationTreeModule,
        NgZorroAntdModule
    ],
    providers: [OrganizationsService],
    exports: [OrganizationsComponent]
})
export class OrganizationsModule {

}

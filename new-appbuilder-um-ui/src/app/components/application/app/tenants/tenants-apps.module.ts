import { TenantsAppsRoutingModule } from './tenants-apps-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TenantsAppsService } from './tenants-apps.service';
import { TenantsAppsComponent } from './tenants-apps.component';
import { CommonModule } from '@angular/common';
import { MoreSearchModule } from '../../../../main/more-search/more-search.module';
import { AddAppDialogModule } from '../dialog/add-app-dialog.module';
import { AppTableModule } from '../table/app-table.module';
import { UploadFilesModule } from '../../../../main/upload/upload-files/upload-files.module';
import { TenantsAppTableModule } from './table/tenants-app-table.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        TenantsAppsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TenantsAppsRoutingModule,
        MoreSearchModule,
        AddAppDialogModule,
        AppTableModule,
        // UploadFilesModule,
        TenantsAppTableModule,
        NgZorroAntdModule
    ],
    providers: [TenantsAppsService],
    exports: [TenantsAppsComponent]
})
export class TenantsAppsModule { }

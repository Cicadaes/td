import { AppsRoutingModule } from './apps-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppsService } from './apps.service';
import { AppsComponent } from './apps.component';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {CommonModule} from '@angular/common';
import {MoreSearchModule} from '../../../main/more-search/more-search.module';
import {AddAppDialogModule} from './dialog/add-app-dialog.module';
import {AppTableModule} from './table/app-table.module';
import {UploadFilesModule} from '../../../main/upload/upload-files/upload-files.module';

@NgModule({
    declarations: [
        AppsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AppsRoutingModule,
        MoreSearchModule,
        AddAppDialogModule,
        AppTableModule,
        UploadFilesModule,
        NgZorroAntdModule
    ],
    providers: [AppsService],
    exports: [AppsComponent]
})
export class AppsModule {

}

import { AddLicencePageRoutingModule} from './add-licence-page-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddLicencePageComponent } from './add-licence-page.component';
import { AddLicencePageService } from './add-licence-page.service';
import {SelectSearchModule} from '../../../main/select/select-search/select-search.module';
import {AddLicenceAttributeDialogModule} from '../addLicence/add-licence-attribute-dialog.module';
import {SelectSearchAppsModule} from '../../../main/select/select-search-apps/select-search-apps.module';
import {CarouselAppManageModule} from '../../../main/carousel/carousel-app-manage/carousel-app-manage.module';

@NgModule({
    declarations: [
        AddLicencePageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SelectSearchModule,
        SelectSearchAppsModule,
        AddLicenceAttributeDialogModule,
        // LicenceBasicInfoModule,
        AddLicencePageRoutingModule,
        CarouselAppManageModule,
        NgZorroAntdModule
    ],
    providers: [AddLicencePageService],
    exports: [AddLicencePageComponent]
})
export class AddLicencePageModule {

}
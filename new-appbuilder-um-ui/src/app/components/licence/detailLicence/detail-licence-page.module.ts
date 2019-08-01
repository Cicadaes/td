import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { DetailLicencePageService } from './detail-licence-page.service';
import { DetailLicencePageComponent } from './detail-licence-page.component';
import { DetailLicencePageRoutingModule } from './detail-licence-page-routing.module';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { EditLicencePageModule } from '../edit/edit-licence-page.module';
import { EditLicenceAttributeDialogModule } from '../editAttribute/edit-licence-attribute-dialog.module';
import { CarouselAppManageModule } from '../../../main/carousel/carousel-app-manage/carousel-app-manage.module';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';
import { AuthLicencesTableModule } from '../authtable/auth-licences-table.module';

@NgModule({
    declarations: [
        DetailLicencePageComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DetailLicencePageRoutingModule,
        EditLicenceAttributeDialogModule,
        EditLicencePageModule,
        CarouselAppManageModule,
        MoreSearchModule,
        AuthLicencesTableModule,
        NgZorroAntdModule
    ],
    providers: [DetailLicencePageService],
    exports: [DetailLicencePageComponent]
})
export class DetailLicencePageModule {

}

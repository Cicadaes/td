import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddAppFormComponent } from './add-app-form.component';
import { SelectSearchModule } from '../../../../main/select/select-search/select-search.module';
import { UploadImagesModule } from '../../../../main/upload/upload-images/upload-images.module';
import { SelectSearchAppsModule } from '../../../../main/select/select-search-apps/select-search-apps.module';

@NgModule({
    declarations: [
        AddAppFormComponent
    ],
    imports: [
        UploadImagesModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SelectSearchModule,
        SelectSearchAppsModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [AddAppFormComponent]
})
export class AddAppFormModule {

}

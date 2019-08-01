import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {EditAppFormComponent} from './edit-app-form.component';
import {SelectSearchModule} from "../../../main/select/select-search/select-search.module";
import {SelectSearchAppsModule} from "../../../main/select/select-search-apps/select-search-apps.module";
import {UploadImagesModule} from "../../../main/upload/upload-images/upload-images.module";

@NgModule({
    declarations: [
        EditAppFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SelectSearchModule,
        SelectSearchAppsModule,
        UploadImagesModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [EditAppFormComponent]
})
export class EditAppFormModule {

}
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddActionFormComponent } from './add-action-form.component';
import { SelectSearchModule } from '../../../../main/select/select-search/select-search.module';
import { ActionAttributeModule } from '../actionAttribute/action-attribute.module';
import { AddActionFormService } from './add-action-form.service';
import { UploadImagesModule } from '../../../../main/upload/upload-images/upload-images.module';



@NgModule({
    declarations: [
        AddActionFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SelectSearchModule,
        ActionAttributeModule,
        UploadImagesModule,
        NgZorroAntdModule
    ],
    providers: [AddActionFormService],
    exports: [AddActionFormComponent]
})
export class AddActionFormModule {

}

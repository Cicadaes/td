import { ConfigurationRoutingModule } from './configuration-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { ConfigurationService } from './configuration.service';
import { ConfigurationComponent } from './configuration.component';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { UploadImagesModule } from '../../main/upload/upload-images/upload-images.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        ConfigurationComponent
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        UploadImagesModule,
        ConfigurationRoutingModule,
        ColorPickerModule

    ],
    providers: [ConfigurationService],
    exports: [ConfigurationComponent]
})
export class ConfigurationModule {
}

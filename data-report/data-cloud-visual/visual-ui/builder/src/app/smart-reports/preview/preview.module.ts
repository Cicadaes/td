import { PreviewInfoComponent } from './preview-info/preview-info.component';
import { PreviewStageComponent } from './preview-stage/preview-stage.component';
import { ChartsPreviewService } from './../services/preview-service/preview.service';
import { PreviewComponent } from './preview.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { StageService } from './../services/stage.service';
import { StageResourceService } from './../services/stage-service/stage.resource.service';
import {DialogDataModule} from './../common/dialog/dialog.module';
import {DialogModule} from 'primeng/primeng';

import {DialogCommunicationService} from "./../common/dialog/dialog.communication.service";

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule,DialogDataModule,DialogModule],
    declarations: [PreviewComponent, PreviewInfoComponent, PreviewStageComponent],
    exports: [PreviewComponent],
    providers: [StageService,ChartsPreviewService,StageResourceService,DialogCommunicationService]
})

export class PreviewModule {  }
// import {DialogDataModule} from '../../common/dialog/dialog.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {DialogModule} from 'primeng/primeng';
import {FormsModule}   from '@angular/forms';
import { ReportsComponent } from './reports.component';
import { ChartsStageComponent } from './charts-stage/charts-stage.component';
import { ChartsBuilderComponent } from './charts-builder/charts-builder.component';
import { ChartsPagesComponent } from './charts-builder/charts-pages/charts-pages.component';

// import {DialogCommunicationService} from "../services/stage-service/dialog.communication.service";


// import { CarouselModule } from 'primeng/primeng'
// import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';


@NgModule({
    imports: [CommonModule,FormsModule],
    declarations: [ReportsComponent, ChartsBuilderComponent, ChartsPagesComponent, ChartsStageComponent],
    exports: [ReportsComponent]

})
export class ReportsModule { }
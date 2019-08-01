import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {DialogDataModule} from './common/dialog/dialog.module';
import {DialogModule} from 'primeng/primeng';

import { SmartHeaderComponent } from './header/header.component';
import { SmartComponent } from './smart.component';

import { ReportsModule } from './reports/reports.module';
import { ConfigsModule } from './configs/configs.module';

import { StageService } from './services/stage.service';
import { StageResourceService } from './services/stage-service/stage.resource.service';

import {DialogCommunicationService} from "./common/dialog/dialog.communication.service";


// import { SmartRoutingModule } from '../routers/smart/smart-routing.module'

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, ReportsModule, ConfigsModule,DialogDataModule,DialogModule],
    declarations: [SmartComponent, SmartHeaderComponent],
    exports: [SmartComponent],
    providers: [StageService, StageResourceService,DialogCommunicationService]
})
export class SmartModule { }
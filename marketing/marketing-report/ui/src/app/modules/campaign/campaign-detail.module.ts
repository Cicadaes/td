import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';
import {FormsModule}   from '@angular/forms';

// modules
import { CampaignDetailRoutingModule } from "../../routers/campaign/campaign-detail.routing";
import {PaginatorxModule} from '../../common/paginator/paginator.module';
import {DatePickerModule} from "../../common/datePicker/datePicker.module";
import { DateFromatPipeModule } from "../pipes/dateFormat-pipe.module";
import { ReportModule } from './../report/report.module';
import { IFrameModule } from "../../common/iframe/iframe.module";
import { LimitNumberInputDirectiveModule } from '../directives/limitNumberInput.direcitve.module';
import {
    InputTextModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    TabViewModule,
    DataTableModule,
    PaginatorModule,
    AccordionModule,
    FileUploadModule,
    InputTextareaModule,
    CheckboxModule,
    SliderModule,
    InputSwitchModule,
    SelectButtonModule,
    TooltipModule,
    OverlayPanelModule,
    CalendarModule,
    EditorModule,
    SharedModule,
    RadioButtonModule,
    GrowlModule,
    ConfirmDialogModule,
} from "primeng/primeng";

// pipes

import { FormatDataPipe } from "../../pipes/formatData.pipe";
import { FormatPromotionDataPipe } from "../../pipes/formatPromotionDate-pipe";

// components
import { CampaignDetailComponent } from "../../components/campaign/detail/campaign-detail.component";
import { PlanTargetComponent } from "../../components/campaign/detail/plan-target/plan-target.component";
import { LaunchUnitComponent } from "../../components/campaign/detail/launch-unit/launch-unit.component";
import { CrowdCategoryDialogComponent } from "../../components/campaign/detail/launch-unit/dialog/crowd-category-dialog.component";
import { CrowdFormComponent } from "../../components/campaign/detail/launch-unit/crowd/crowd-form.component";
import { PreciseCrowdFormComponent } from "../../components/campaign/detail/launch-unit/precise-crowd/precise-crowd-form.component";
import { UnitComponent } from "../../components/campaign/detail/launch-unit/unit/unit.component";
import { PushListComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/push-list.component";
import { CreatePutEventComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/create-put-event.component";
import { AppPushPieceComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/app-push/app-push-piece.component";
import { AppPushMessageComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/app-push/app-push-message.component";
import { PushTextEditorComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/app-push/android-push/push-text-editor.component";
import { IOSMsgConfigComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/app-push/ios-push/ios-msg-config.component";
import { AndroidMsgConfigComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/app-push/android-push/android-msg-config.component";
import { IOSPushConfigComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/app-push/ios-push/ios-push-config.component";
import { AndroidPushConfigComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/app-push/android-push/push-config.component";
import { AndroidIntensifyPushConfigComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/app-push/android-push/intensify-push-config.component";
import { CreatePutEventTimeComponent } from "../../components/campaign/detail/launch-unit/unit/push-list/create-put/smsChannel-push/create-put-event-time.component";
import { SubCrowdListComponent } from "../../components/campaign/detail/launch-unit/unit/sub-crowd-list/sub-crowd-list.component";
import { CrowdPortraitComponent } from "../../components/campaign/detail/launch-unit/unit/sub-crowd-list/crowd-portrait.component";
import { PersonasComponent } from "../../components/campaign/detail/launch-unit/unit/personas.component";
import { CreatePutEventMsgComponent } from './../../components/campaign/detail/launch-unit/unit/push-list/create-put/smsChannel-push/create-put-event-msg.component';
import { CampaignReportComponent } from './../../components/campaign/report/campaign-report.component';
import { EquityConfigComponent } from './../../components/campaign/detail/equity-config/equity-config.component';
import { MktProcessComponent } from './../../components/campaign/detail/mkt-process/mkt-process.component';
import { EdmPushComponent } from '../../components/campaign/detail/launch-unit/unit/push-list/create-put/edm-push/edm-push.component';

// services
import { IFrameCommunicationService } from "../../common/iframe/iframe.communication.service";
import { FormatNumberPipeModule } from "../pipes/formatNumber.pipe.module";
import { ErrorHandlingService } from "../../services/exceptional/error-handling.service";
import { EquityConfigResourceService } from '../../services/campaign/equity_config.resource.service';

// directives

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CampaignDetailRoutingModule,
        DatePickerModule,
        PaginatorxModule,
        DateFromatPipeModule,
        FormatNumberPipeModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        DialogModule,
        TabViewModule,
        DataTableModule,
        PaginatorModule,
        AccordionModule,
        FileUploadModule,
        InputTextareaModule,
        CheckboxModule,
        OverlayPanelModule,
        SliderModule,
        InputSwitchModule,
        SelectButtonModule,
        TooltipModule,
        CalendarModule,
        EditorModule,
        SharedModule,
        RadioButtonModule,
        GrowlModule,
        ConfirmDialogModule,
        ReportModule,
        IFrameModule,
        LimitNumberInputDirectiveModule
    ],
    declarations: [
        // CampaignReportComponent,
        FormatDataPipe,
        FormatPromotionDataPipe,
        CampaignDetailComponent,
        PlanTargetComponent,
        LaunchUnitComponent,
        CrowdCategoryDialogComponent,
        CrowdFormComponent,
        PreciseCrowdFormComponent,
        UnitComponent,
        PushListComponent,
        CreatePutEventComponent,
        AppPushPieceComponent,
        AppPushMessageComponent,
        PushTextEditorComponent,
        IOSMsgConfigComponent,
        AndroidMsgConfigComponent,
        IOSPushConfigComponent,
        AndroidPushConfigComponent,
        AndroidIntensifyPushConfigComponent,
        CreatePutEventTimeComponent,
        SubCrowdListComponent,
        CrowdPortraitComponent,
        PersonasComponent,
        CreatePutEventMsgComponent,
        EquityConfigComponent,
        MktProcessComponent,
        EdmPushComponent
    ],
    providers: [
        IFrameCommunicationService,
        ErrorHandlingService,
        EquityConfigResourceService
    ]
})
export class CampaignDetailModule {

}
import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';
import {FormsModule}   from '@angular/forms';

import {
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    SliderModule,
    DialogModule,
    GrowlModule,
    EditorModule,
    SelectButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    DataTableModule
} from 'primeng/primeng';

import { DatePickerModule } from './../../common/datePicker/datePicker.module';
import { LimitNumberInputDirectiveModule } from '../directives/limitNumberInput.direcitve.module';
import { LimitInputLengthDirectiveModule } from '../directives/limitInputLength.directive.module';

import { AutomationRoutingModule } from './../../routers/campaign/automation.routing';
import { IFrameModule } from "../../common/iframe/iframe.module";
import { ReportModule } from '../report/report.module';

// components
import { AutomationComponent } from './../../components/campaign/automation/automation.component';
import { InletPipeComponent } from './../../components/campaign/automation/inlet-pipe/inlet-pipe.component';
import { DistributaryPipeComponent } from './../../components/campaign/automation/distributary-pipe/distributary-pipe.component';
import { TriggerPipeComponent } from './../../components/campaign/automation/trigger-pipe/trigger-pipe.component';
import { SmsPipeComponent } from './../../components/campaign/automation/sms-pipe/sms-pipe.component';
import { CreateCrowdComponent } from "../../components/campaign/automation/inlet-pipe/crowd/create-crowd.component/create-crowd.component";
import { ResultCrowdPipeComponent } from '../../components/campaign/automation/result-crowd-pipe/result-crowd-pipe.component';
import { PushPipeComponent } from './../../components/campaign/automation/push-pipe/push-pipe.component';
import { TimingPipeComponent } from './../../components/campaign/automation/timing-pipe/timing-pipe.component';
import { FilterPipeComponent } from "../../components/campaign/automation/filter-pipe/filter-pipe.component";
import { GlobalRuleComponent } from "../../components/campaign/automation/global-rule/global-rule.component";
import { BaseDescComponent } from '../../components/campaign/automation/base-desc/base-desc.component';
import { PushPipeReportComponent } from '../../components/campaign/automation/push-pipe/push-pipe-report.component';
import { SmsPipeReportComponent } from '../../components/campaign/automation/sms-pipe/sms-pipe-report.component';

// services
import { ErrorHandlingService } from "../../services/exceptional/error-handling.service";
import { IFrameCommunicationService } from "../../common/iframe/iframe.communication.service";
import { ProhibitedToUseDirectiveModule } from '../directives/prohibitedToUse.directive.module';

// pipes 
import { FilterTagsPipeModule } from '../pipes/filterTags.pipe.module';
import { TriggerEventPipe } from "../../pipes/triggerEvent.pipe";
import { DateFromatPipeModule } from '../pipes/dateFormat-pipe.module';
import { FormatNumberPipeModule } from '../pipes/formatNumber.pipe.module';


@NgModule({
    imports: [
        AutomationRoutingModule,
        CommonModule,
        FormsModule,
        DropdownModule,
        DatePickerModule,
        DataTableModule,
        CalendarModule,
        CheckboxModule,
        SliderModule,
        DialogModule,
        IFrameModule,
        GrowlModule,
        EditorModule,
        SelectButtonModule,
        TooltipModule,
        ConfirmDialogModule,
        LimitNumberInputDirectiveModule,
        LimitInputLengthDirectiveModule,
        ProhibitedToUseDirectiveModule,
        FilterTagsPipeModule,
        DateFromatPipeModule,
        FormatNumberPipeModule,
        ReportModule
    ],
    declarations: [
        AutomationComponent,
        InletPipeComponent,
        DistributaryPipeComponent,
        TriggerPipeComponent,
        SmsPipeComponent,
        PushPipeComponent,
        CreateCrowdComponent,
        TimingPipeComponent,
        ResultCrowdPipeComponent,
        FilterPipeComponent,
        GlobalRuleComponent,
        BaseDescComponent,
        PushPipeReportComponent,
        SmsPipeReportComponent,
        TriggerEventPipe
    ],
    providers:[
        ErrorHandlingService,
        IFrameCommunicationService
    ],
    exports: [
    ]
})
export class AutoMationModule {
    
}

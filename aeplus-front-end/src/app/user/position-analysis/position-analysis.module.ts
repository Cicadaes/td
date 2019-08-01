import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PositionAnalysisRoutingModule} from './position-analysis.routing';
import {PositionAnalysisComponent} from './position-analysis.component';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {FormsModule} from '@angular/forms';
import {PositionAnalysisService} from './position-analysis.service';
import {DatePickerService} from './date-picker.service';
import {PositionAnalysisPipe} from './position-analysis.pipe';
import {ControlPanelComponent} from './control-panel/control-panel.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PositionAnalysisRoutingModule,
        NgZorroAntdModule.forRoot()
    ],
    declarations: [
        PositionAnalysisComponent,
        PositionAnalysisPipe,
        ControlPanelComponent
    ],
    providers: [
        PositionAnalysisService,
        DatePickerService,
    ]
})
export class PositionAnalysisModule {
}

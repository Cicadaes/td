import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionAnalysisRoutingModule } from './position-analysis.routing';
import { PositionAnalysisComponent } from './position-analysis.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { PositionAnalysisService } from './position-analysis.service';
import { DatePickerService } from './date-picker.service';
import { PositionAnalysisPipe } from './position-analysis.pipe';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { ChinaMapChartModule } from '../../main/echarts/china-map-chart/china-map-chart.module';

@NgModule({
  imports: [CommonModule, FormsModule, PositionAnalysisRoutingModule, ChinaMapChartModule, NgZorroAntdModule.forRoot()],
  declarations: [PositionAnalysisComponent, PositionAnalysisPipe, ControlPanelComponent],
  providers: [PositionAnalysisService, DatePickerService]
})
export class PositionAnalysisModule {}

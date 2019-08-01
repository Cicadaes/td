import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAnalysisComponent } from './custom-analysis.component';
import { ShareReportComponent } from './share-report/share-report.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule],
  declarations: [CustomAnalysisComponent, CreateReportComponent, ShareReportComponent]
})
export class CustomAnalysisModule {}

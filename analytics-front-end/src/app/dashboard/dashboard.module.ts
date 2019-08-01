import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLayoutComponent } from './data-layout/data-layout.component';
import { DataViewerComponent } from './data-viewer/data-viewer.component';
import { DashboardRoutingModule } from './dashboard.routing';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  declarations: [DataLayoutComponent, DataViewerComponent]
})
export class DashboardModule {
}

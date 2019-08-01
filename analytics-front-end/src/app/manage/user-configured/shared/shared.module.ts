import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DetailComponent } from '../components/configured/detail/detail.component';
import { EditComponent } from '../components/configured/edit/edit.component';

@NgModule({
  declarations: [DetailComponent, EditComponent],
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, NgZorroAntdModule],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    DetailComponent,
    EditComponent
  ],
  providers: [DecimalPipe, PercentPipe]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}

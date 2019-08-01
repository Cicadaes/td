// MODULES
import { ModuleWithProviders, NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

// SERVICES
import { AppCommunicationService } from './communication-service/app-communication.service';
import { ApplistService, RoleListService } from './transform-service';
import { ScrollToTopService } from './scroll-service';
// PIPES
import { TrimPipe, sexLabelPipe } from '../pipes';
// COMPONENTS
import { UmDialogComponent } from '../main/layouts';

const MODULES = [
  FormsModule,
  CommonModule
];

const SERVICES = [
  AppCommunicationService,
  ApplistService,
  RoleListService,
  ScrollToTopService
];

const PIPES = [
  TrimPipe,
  sexLabelPipe
];

const COMPONENTS = [
  UmDialogComponent
];

@NgModule({
  imports: [...MODULES, NgZorroAntdModule],
  exports: [...COMPONENTS, ...PIPES, ...MODULES],
  declarations: [...COMPONENTS, ...PIPES],
})

// 暂时不需要provider，以后会添加
export class UMThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: UMThemeModule,
      providers: [...SERVICES],
    };
  }
}

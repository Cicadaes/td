import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LogoService } from './logo.service';
import { LogoComponent } from './logo.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
  declarations: [
    LogoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgZorroAntdModule
  ],
  providers: [LogoService],
  exports: [LogoComponent]
})
export class LogoModule {

}

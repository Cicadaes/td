import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../config/shared/shared.module';

// import Contants
import { EFFECT_ROUTES } from './effect_routes';

// import Components
import { EffectContainerComponent } from './effect-container.component';
import { WxBlogContainerComponent } from './wx-blog/wx-blog-container.component';
import { EffectTemplateComponent } from './effect-template/effect-template.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(EFFECT_ROUTES)
  ],
  declarations: [
    EffectContainerComponent,
    WxBlogContainerComponent,
    EffectTemplateComponent,
],
  providers: [],
  exports: [
    EffectContainerComponent,
    WxBlogContainerComponent
  ]
})
export class EffectContainerModule { }
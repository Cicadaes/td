import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataSearchComponent } from './data-search.component';

const appRoutes: Routes = [
  {
    path: '',
    component: DataSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DataSearchRoutingModule {}

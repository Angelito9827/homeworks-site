import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HousesListComponent } from './houses-list/houses-list.component';
import { HousesAddComponent } from './houses-add/houses-add.component';

const routes: Routes = [
  { path: '', component: HousesListComponent },
  { path: 'new', component: HousesAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousesRoutingModule { }

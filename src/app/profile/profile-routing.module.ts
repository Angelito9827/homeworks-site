import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { EditDeleteProfileComponent } from './edit-delete-profile/edit-delete-profile.component';

const routes: Routes = [
  {path: '', component: ProfileComponent},
  {path: 'edit-delete-profile', component: EditDeleteProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

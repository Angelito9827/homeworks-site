import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { ActiveTasksComponent } from './active-tasks/active-tasks.component';
import { AddTasksComponent } from './add-tasks/add-tasks.component';


const routes: Routes = [
  { path: '', component: TasksListComponent },
  { path: 'house/:houseId/category/:categoryId', component: ActiveTasksComponent },
  { path: 'house/:houseId/newTask', component: AddTasksComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TasksRoutingModule { }

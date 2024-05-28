import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ActiveTasksComponent } from './active-tasks/active-tasks.component';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditDeleteTasksComponent } from './edit-delete-tasks/edit-delete-tasks.component';



@NgModule({
  declarations: [
    TasksComponent,
    TasksListComponent,
    ActiveTasksComponent,
    AddTasksComponent,
    EditDeleteTasksComponent,

  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TasksModule { }

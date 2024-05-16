import { Component } from '@angular/core';
import { GetAllTasksResponse } from '../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../services/tasks-service/task.service';
import { GetAllTasksRequest } from '../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.request';
import { TaskState } from '../models/task-status.enum';

@Component({
  selector: 'app-active-tasks',
  templateUrl: './active-tasks.component.html',
  styleUrl: './active-tasks.component.css'
})
export class ActiveTasksComponent {

  activeTasksResponse?: GetAllTasksResponse;

  constructor(private activatedRoute: ActivatedRoute, private taskService: TaskService) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe(params=>{
      this.getTasks(params['houseId'], params['categoryId']);
    })
  }

  private getTasks (houseId:number, categoryId:number) {
    let request: GetAllTasksRequest = {houseId:houseId, categoryId:categoryId, taskState:TaskState.IN_PROGRESS}
    this.taskService.getAllTasks(request)
    .pipe()
    .subscribe({
      next: (response: GetAllTasksResponse) => {
        this.activeTasksResponse = response;
      }
    })

  }

}

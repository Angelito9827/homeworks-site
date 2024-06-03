import { Component } from '@angular/core';
import { GetAllTasksResponse } from '../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../services/tasks-service/task.service';
import { GetAllTasksRequest } from '../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.request';
import { TaskState } from '../models/task-status.enum';
import { GetHouseByIdResponse } from '../../houses/models/get-house-by-id/get-house-by-id-response';
import { HouseService } from '../../houses/services/house-service/house.service';

@Component({
  selector: 'app-active-tasks',
  templateUrl: './active-tasks.component.html',
  styleUrl: './active-tasks.component.css'
})
export class ActiveTasksComponent {
  
  state = TaskState;
  activeTasksResponse?: GetAllTasksResponse;
  houseResponse?: GetHouseByIdResponse;

  constructor(private activatedRoute: ActivatedRoute, private taskService: TaskService, private houseService:HouseService) 
  {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const houseId = params['houseId'];
      const categoryId = params['categoryId'];
      this.getHouseById(houseId);
      this.getTasks(houseId, categoryId);
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

  private getHouseById(houseId: number) {
    this.houseService.getHouseById({ id: houseId }).subscribe({
      next: (response: GetHouseByIdResponse) => {
        this.houseResponse = response;
      }
    });
  }

}

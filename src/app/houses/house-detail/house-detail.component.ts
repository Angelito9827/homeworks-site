import { Component } from '@angular/core';
import { TaskService } from '../../tasks/task-service/task.service';
import { GetActiveTasksListByHouseIdResponse } from '../../tasks/models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { GetActiveTasksListByHouseIdRequest } from '../../tasks/models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.request';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrl: './house-detail.component.css'
})
export class HouseDetailComponent {

  response?: GetActiveTasksListByHouseIdResponse;

  constructor(private taskService: TaskService) {
  }

  // private getActiveTasksByHouseId() {
  //     this.taskService.get(this.request)
  //     .pipe()
  //     .subscribe({
  //       next: (response: GetActiveTasksListByHouseIdResponse) => {
  //         console.log(response);
  //           this.response = response;
  //       }
  //     });
  // }
}

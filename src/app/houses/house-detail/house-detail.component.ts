import { Component } from '@angular/core';
import { TaskService } from '../../tasks/task-service/task.service';
import { GetActiveTasksListByHouseIdResponse } from '../../tasks/models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { GetActiveTasksListByHouseIdRequest } from '../../tasks/models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.request';
import { ActivatedRoute } from '@angular/router';
import { HouseService } from '../services/house-service/house.service';
import { GetHouseByIdResponse } from '../models/get-house-by-id/get-house-by-id-response';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrl: './house-detail.component.css'
})
export class HouseDetailComponent {

  activeTasksResponse?: GetActiveTasksListByHouseIdResponse;
  houseResponse?: GetHouseByIdResponse;

  constructor(private taskService: TaskService, private houseService:HouseService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe(params=>{
      this.getActiveTasksByHouseId(params['id']);
      this.getHouseById(params['id']);
    })
  }

   private getActiveTasksByHouseId(id:number) {
       this.taskService.getActiveTasksListByHouseId({houseId:id})
       .pipe()
       .subscribe({
         next: (response: GetActiveTasksListByHouseIdResponse) => {
           console.log(response);
             this.activeTasksResponse = response;
         }
       })
   }

   private getHouseById(id:number) {
    this.houseService.getHouseById({id:id})
    .pipe()
    .subscribe({
      next: (response: GetHouseByIdResponse) => {
        this.houseResponse = response;
      }
    })
   }
}

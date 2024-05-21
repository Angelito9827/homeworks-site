import { Component } from '@angular/core';
import { TaskService } from '../../tasks/services/tasks-service/task.service';
import { GetAllTasksResponse } from '../../tasks/models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';
import { GetAllTasksRequest } from '../../tasks/models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.request';
import { ActivatedRoute } from '@angular/router';
import { HouseService } from '../services/house-service/house.service';
import { GetHouseByIdResponse } from '../models/get-house-by-id/get-house-by-id-response';
import { GetHouseMemberListByHouseIdResponse } from '../models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.response';
import { HouseMemberService } from '../services/house-member-service/house-member.service';
import { TaskState } from '../../tasks/models/task-status.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SendInvitationEmailRequest } from '../models/send-invitation-email/send-invitation-email.request';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrl: './house-detail.component.css'
})
export class HouseDetailComponent {

  activeTasksResponse?: GetAllTasksResponse;
  houseResponse?: GetHouseByIdResponse;
  houseMembersResponse?: GetHouseMemberListByHouseIdResponse;
  form!: FormGroup;
  request: SendInvitationEmailRequest = {
    email: '',
    houseId: 0,
  };

  constructor(private taskService: TaskService, private houseService:HouseService, private activatedRoute: ActivatedRoute, private houseMemberService: HouseMemberService, private formBuilder: FormBuilder,) {

  }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe(params=>{
      this.getActiveTasksByHouseId(params['id']);
      this.getHouseById(params['id']);
      this.getHouseMembersByHouseId(params['id']);
    })

    this.createForm();
  }

   private getActiveTasksByHouseId(id:number) {
    let request: GetAllTasksRequest = {houseId:id, taskState:TaskState.IN_PROGRESS}
       this.taskService.getAllTasks(request)
       .pipe()
       .subscribe({
         next: (response: GetAllTasksResponse) => {
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

   private getHouseMembersByHouseId(id:number) {
    this.houseMemberService.getHouseMembersByHouseId({houseId:id})
    .pipe()
    .subscribe({
      next: (response: GetHouseMemberListByHouseIdResponse) => {
        console.log(response);
        this.houseMembersResponse = response;
      }
    })
   }

   createForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
    });
  }

   stablishRequest() {
    this.request.email = this.form.get('email')?.value;
  }

  areAllStepsValid(): boolean {
    return this.form.valid;
  }

  onSendInvitationButton() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.areAllStepsValid()) {
      console.log('Not all steps are valid');
      return;
    }

    this.stablishRequest();
    console.log('Request stablished');
    this.houseMemberService
      .sendInvitationEmail(this.request)
      .pipe()
      .subscribe({
        next: () => {
          console.log('Miembro añadido exitosamente');
          const closeButton = document.getElementById('x');
          closeButton?.click();
          this.resetForm();
        }
      });
  }

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

}

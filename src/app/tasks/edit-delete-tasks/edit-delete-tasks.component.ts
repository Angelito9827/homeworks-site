import { Component } from '@angular/core';
import { HouseMemberService } from '../../houses/services/house-member-service/house-member.service';
import { GetHouseMemberListByHouseIdResponse } from '../../houses/models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetHouseByIdResponse } from '../../houses/models/get-house-by-id/get-house-by-id-response';
import { TaskService } from '../services/tasks-service/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../houses/services/house-service/house.service';
import { CategoryState } from '../models/category-status.enum';
import { EditTaskRequest } from '../models/edit-task/edit-task.request';
import { GetTaskByIdResponse } from '../models/get-active-task-by-id/get-active-task-by-id.response';
import { GetAllTasksListItemResponse} from '../models/get-active-tasks-list-by-house-id/get-active-tasks-list-by-house-id.response';

@Component({
  selector: 'app-edit-delete-tasks',
  templateUrl: './edit-delete-tasks.component.html',
  styleUrl: './edit-delete-tasks.component.css'
})
export class EditDeleteTasksComponent {

  form!: FormGroup;
  url: any = '';
  fieldErrors: { [key: string]: boolean } = {};
  houseMembersResponse?: GetHouseMemberListByHouseIdResponse;
  houseResponse?:GetHouseByIdResponse;
  attemptedSubmit: boolean = false;
  categories: { label: string, value: number }[] = [];
  request: EditTaskRequest = {} as EditTaskRequest;
  taskResponse?: GetTaskByIdResponse;
  selectedAssignedTo: string = '';
  activeTasksResponse?: GetAllTasksListItemResponse;

  constructor(private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private houseMemberService: HouseMemberService,
    private activatedRoute: ActivatedRoute)
  {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.createForm();
      this.getHouseMembersByHouseId(params['id']);
      this.getCategories();
      this.getTaskById(params['id']);
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]],
      category: ['', [Validators.required]],
      finishDate: ['', [Validators.required]]
    });
  }

  stablishRequest() {
    this.request.name = this.form.get('name')?.value;
    this.request.description = this.form.get('description')?.value;
    this.request.assignedTo = this.form.get('assignedTo')?.value;
    this.request.categoryId = this.form.get('category')?.value;
    this.request.finishDate = this.form.get('finishDate')?.value;
  }

  areAllStepsValid(): boolean {
    return this.form.valid;
  }

  saveForm() {
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
    console.log('Request object:', this.request);

    this.taskService.editTask(this.request)
    .pipe()
    .subscribe({
      next: (taskResponse) => {
        // Manejar la respuesta exitosa
      },
      error: (err) => {
        console.error('Error creating task', err);
      }
    });

    this.router.navigate(['/houses']);
  }

  private getHouseMembersByHouseId(id: number) {
    this.houseMemberService.getHouseMembersByHouseId({ houseId: id })
      .subscribe({
        next: (response: GetHouseMemberListByHouseIdResponse) => {
          this.houseMembersResponse = response;
        },
      });
  }


  private getTaskById(id:number) {
    this.taskService.getTaskById({id:id})
    .pipe()
    .subscribe({
      next: (response: GetTaskByIdResponse) => {
        this.taskResponse = response;
        this.selectedAssignedTo = this.taskResponse.assignedTo;
      }
    })
   }

  private getCategories() {
    this.categories = Object.keys(CategoryState)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ label: key, value: (CategoryState as any)[key] }));
  }

    getMinDate(): string {
      const today = new Date();
      const year = today.getFullYear();
      let month: string | number = today.getMonth() + 1; // Enero es 0
      let day: string | number = today.getDate();
  
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
  
      return `${year}-${month}-${day}`;
    }

  deleteTaskById() {
    console.log('Casa eliminada');
    this.taskService
    .deleteTaskById(this.request)
    .pipe()
    .subscribe({
      next: (taskResponse) => {
      },
      error: (err) => {},
    });
    
    const closeButton = document.getElementById('x');
    closeButton?.click();
    
    this.router.navigate(['/houses']);
    alert("eliminado correctamente"); 
  }
  
  }


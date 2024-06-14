import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateTaskRequest } from '../models/create-task/create-task.request';
import { TaskService } from '../services/tasks-service/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetHouseMemberListByHouseIdResponse } from '../../houses/models/get-house-member-list-by-house-id/get-house-member-list-by-house-id.response';
import { HouseMemberService } from '../../houses/services/house-member-service/house-member.service';
import { HouseService } from '../../houses/services/house-service/house.service';
import { GetHouseByIdResponse } from '../../houses/models/get-house-by-id/get-house-by-id-response';
import { CategoryState } from '../models/category-status.enum';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.css']
})
export class AddTasksComponent implements OnInit {
  user: string = '';
  form!: FormGroup;
  url: any = '';
  fieldErrors: { [key: string]: boolean } = {};
  request: CreateTaskRequest = {} as CreateTaskRequest;
  houseMembersResponse?: GetHouseMemberListByHouseIdResponse;
  houseResponse?: GetHouseByIdResponse;
  attemptedSubmit: boolean = false;
  categories: { label: string, value: number }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private houseMemberService: HouseMemberService,
    private activatedRoute: ActivatedRoute,
    private houseService: HouseService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole();
    this.activatedRoute.params.subscribe(params => {
      this.createForm();
      this.getHouseMembersByHouseId(params['id']);
      this.getHouseById(params['id']);
      this.getCategories();
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

  stablishRequest(): FormData {
    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('assignedTo', this.form.get('assignedTo')?.value);
    formData.append('category', this.form.get('category')?.value);
    formData.append('finishDate', this.form.get('finishDate')?.value);

    return formData;
  }

  areAllStepsValid(): boolean {
    return this.form.valid;
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    if (!this.areAllStepsValid()) {
      console.log('Not all steps are valid');
      return;
    }

    const formData = this.stablishRequest(); 

    this.taskService.createTask(formData)
    .pipe()
    .subscribe({
      next: (response) => {
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

  private getHouseById(id: number) {
    this.houseService.getHouseById({ id: id })
      .subscribe({
        next: (response: GetHouseByIdResponse) => {
          this.houseResponse = response;
        },
      });
  }

  private getCategories() {
    this.categories = Object.keys(CategoryState)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ label: key, value: (CategoryState as any)[key] }));
  }

  getMinDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month: string | number = today.getMonth() + 1;
    let day: string | number = today.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
  }
}

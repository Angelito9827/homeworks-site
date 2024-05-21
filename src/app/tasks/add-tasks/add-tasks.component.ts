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

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.css']
})
export class AddTasksComponent implements OnInit {



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
    private houseService: HouseService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.createForm();
      this.getHouseMembersByHouseId(params['id']);
      this.getHouseById(params['id']);
      this.getCategories();
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      taskName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedMember: ['', [Validators.required]],
      category: ['', [Validators.required]],
      finishDate: ['', [Validators.required]]
    });
  }

  checkErrors() {
    return Object.values(this.fieldErrors).some(error => error);
  }

  setFieldError(fieldName: string, hasError: boolean) {
    this.fieldErrors[fieldName] = hasError;
  }

  validateFields() {
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      this.setFieldError(controlName, control?.invalid || false);
    });
    if (!this.checkErrors()) {
      this.submitForm();
    }
  }

  stablishRequest() {
    this.request.taskName = this.form.get('taskName')?.value;
    this.request.description = this.form.get('description')?.value;
    this.request.assignedTo = this.form.get('assignedMember')?.value;
    this.request.categoryId = this.form.get('category')?.value;
    this.request.finishDate = this.form.get('finishDate')?.value;
  }

  areAllStepsValid(): boolean {
    return this.form.valid;
  }

  onSelectFile(event: any) {
    if (event && event.target && event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (eventLoad) => {
        if (eventLoad && eventLoad.target) {
          this.url = eventLoad.target.result;
          console.log(this.url);
        }
      };
    }
  }

  delete() {
    this.url = null;
  }

  submitForm() {
    if (!this.areAllStepsValid()) {
      console.log('Not all steps are valid');
      return;
    }

    this.stablishRequest();
    console.log('Request stablished');
    console.log('Request object:', this.request);

    this.taskService.createTask(this.request).subscribe({
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from '../services/house-service/house.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetHouseByIdResponse } from '../models/get-house-by-id/get-house-by-id-response';
import { EditHouseRequest } from '../models/edit-house/edit-house.request';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-house-edit-delete',
  templateUrl: './house-edit-delete.component.html',
  styleUrl: './house-edit-delete.component.css'
})
export class HouseEditDeleteComponent {
  user: string = '';
  form!: FormGroup;
  url: any = '';
  houseResponse?: GetHouseByIdResponse;
  attemptedSubmit: boolean = false;
  request: EditHouseRequest = {} as EditHouseRequest;

  constructor(
    private formBuilder: FormBuilder,
    private houseService: HouseService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole();
    this.activatedRoute.params
    .subscribe(params=>{
      this.getHouseById(params['id']);
    })
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      address: ['', [Validators.required]],
      profileImage: [''],
    });
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

  public delete() {
    this.url='assets/img/photo_camera.png';
    this.form.get ('profilePicture')?.setValue(null);
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

   stablishRequest() {
     this.request.name = this.form.get('name')?.value;
     this.request.description = this.form.get('description')?.value;
     this.request.address = this.form.get('address')?.value;
     const file = this.form.get('profileImage')?.value;
     if (file) {
       const formData = new FormData();
       formData.append('profileImage', file);
       this.request.profileImage = formData;
      }
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
      this.houseService
      .editHouse(this.request)
      .pipe()
      .subscribe({
        next: (houseResponse) => {
        },
        error: (err) => {},
      });
      
      const houseId = this.houseResponse?.id;
      this.router.navigate(['/houses', houseId]);
      
    }

    deleteHouseById() {
      console.log('Casa eliminada');
      this.houseService
      .deleteHouseById(this.request)
      .pipe()
      .subscribe({
        next: (houseResponse) => {
        },
        error: (err) => {},
      });

      const closeButton = document.getElementById('x');
      closeButton?.click();
      
      this.router.navigate(['/houses']);
      alert("Casa eliminida correctamente");
    }

  }
  
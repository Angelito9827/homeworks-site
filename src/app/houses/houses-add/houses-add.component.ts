import { Component} from '@angular/core';
import { HouseService } from '../services/house-service/house.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateHouseRequest } from '../models/create-house/create-house.request';

@Component({
  selector: 'app-houses-add',
  templateUrl: './houses-add.component.html',
  styleUrl: './houses-add.component.css',
})
export class HousesAddComponent {
  form!: FormGroup;
  url: any = '';
  request: CreateHouseRequest = {} as CreateHouseRequest;
  attemptedSubmit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private houseService: HouseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

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
    this.url = null;
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

    this.stablishRequest();
    console.log('Request stablished');
    console.log('Request object:', this.request);
    this.houseService
      .createHouse(this.request)
      .pipe()
      .subscribe({
        next: (response) => {
          //Saco un modal diciend
        },
        error: (err) => {
          console.error('Error creating house', err);
        },
      });

    this.router.navigate(['/houses']);
  }
}

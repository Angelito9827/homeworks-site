import { Component} from '@angular/core';
import { HouseService } from '../services/house-service/house.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateHouseRequest } from '../models/create-house/create-house.request';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-houses-add',
  templateUrl: './houses-add.component.html',
  styleUrl: './houses-add.component.css',
})
export class HousesAddComponent {
  user: string = '';
  form!: FormGroup;
  url: any = '';
  imageSelected = false;
  request: CreateHouseRequest = {} as CreateHouseRequest;


  constructor(
    private formBuilder: FormBuilder,
    private houseService: HouseService,
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.user = this.authService.getRole();
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      address: ['', [Validators.required]],
      profileImage: [''] // Control para la imagen de perfil
    }, {
      validator: this.imageValidator('profileImage') // Validador personalizado para la imagen
    });
  }

  imageValidator(controlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      if (control.value instanceof FileList && control.value.length === 0) {
        control.setErrors({ 'required': true });
      }
    };
  }

  stablishRequest(): FormData {
    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('address', this.form.get('address')?.value);
    const file = this.form.get('profileImage')?.value;
    if (file) {
      formData.append('profileImage', file);
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    
    return formData;
  }

  areAllStepsValid(): boolean {
    return this.form.valid;
  }

  onSelectFile(event: any) {
    const file = event.target.files[0]; // Obtiene el archivo directamente
    if (file) {
      this.imageSelected = true; // Indica que se ha seleccionado una imagen
      const reader = new FileReader(); // Crea un lector de archivos
      reader.readAsDataURL(file); // Lee el archivo como una URL
      reader.onload = () => {
        this.url = reader.result; // Establece la URL de la imagen
      };
      this.form.get('profileImage')?.setValue(file); // Establece el valor como el archivo
    }
  }

  delete() {
    this.url = null; // Elimina la URL de la imagen
    this.form.get('profileImage')?.setValue(null); // Limpia el campo de la imagen
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
    
    console.log('Request stablished');
    console.log('Request object:', this.request);
    this.houseService
      .createHouse(formData)
      .pipe()
      .subscribe({
        next: (response) => {
          //Saco un modal diciend
        },
        error: (err) => {
          console.error('Error creating house', err);
        },
      });

      console.log(formData);
    this.router.navigate(['/houses']);
  }
}

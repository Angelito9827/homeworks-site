import { Component } from '@angular/core';
import { HouseService } from '../services/house-service/house.service'; // Importación del servicio HouseService
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importaciones para FormBuilder y Validators
import { Router } from '@angular/router'; // Importación de Router para navegación
import { CreateHouseRequest } from '../models/create-house/create-house.request'; // Importación del modelo CreateHouseRequest
import { AuthService } from '../../auth/services/auth.service'; // Importación del servicio AuthService

@Component({
  selector: 'app-houses-add',
  templateUrl: './houses-add.component.html',
  styleUrls: ['./houses-add.component.css'], // Establecer styleUrls para estilos específicos del componente
})
export class HousesAddComponent {
  user: string = ''; // Inicializar variable user para el rol del usuario
  form!: FormGroup; // Inicializar form como FormGroup
  url: any = ''; // Inicializar url variable
  imageSelected = false; // Variable para indicar si se ha seleccionado una imagen
  request: CreateHouseRequest = {} as CreateHouseRequest; // Inicializar objeto request de tipo CreateHouseRequest

  constructor(
    private formBuilder: FormBuilder, // Inyectar FormBuilder para la creación de formularios
    private houseService: HouseService, // Inyectar HouseService para métodos relacionados con las casas
    private router: Router, // Inyectar Router para navegación
    private authService: AuthService // Inyectar AuthService para obtener el rol del usuario
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole(); // Obtener el rol del usuario actual
    this.createForm(); // Llamar al método createForm al inicializar el componente
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]], // Definir control 'name' con validador requerido
      description: ['', [Validators.required]], // Definir control 'description' con validador requerido
      address: ['', [Validators.required]], // Definir control 'address' con validador requerido
      profileImage: [''], // Control para la imagen de perfil
    }, {
      validator: this.imageValidator('profileImage') // Validador personalizado para la imagen de perfil
    });
  }

  imageValidator(controlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      if (control.value instanceof FileList && control.value.length === 0) {
        control.setErrors({ 'required': true }); // Establecer error requerido si no se ha seleccionado ningún archivo
      }
    };
  }

  stablishRequest(): FormData {
    const formData = new FormData(); // Crear objeto FormData para enviar datos al servidor
    formData.append('name', this.form.get('name')?.value); // Agregar nombre al formulario
    formData.append('description', this.form.get('description')?.value); // Agregar descripción al formulario
    formData.append('address', this.form.get('address')?.value); // Agregar dirección al formulario
    const file = this.form.get('profileImage')?.value; // Obtener archivo de imagen de perfil seleccionado
    if (file) {
      formData.append('profileImage', file); // Agregar imagen de perfil al formulario si existe
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`); // Mostrar cada campo y valor del FormData en la consola
    });
    
    return formData; // Devolver el objeto FormData construido
  }

  areAllStepsValid(): boolean {
    return this.form.valid; // Verificar si todos los pasos del formulario (controles) son válidos
  }

  onSelectFile(event: any) {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      this.imageSelected = true; // Indicar que se ha seleccionado una imagen
      const reader = new FileReader(); // Crear un lector de archivos
      reader.readAsDataURL(file); // Leer el archivo como una URL
      reader.onload = () => {
        this.url = reader.result; // Establecer la URL de la imagen seleccionada
      };
      this.form.get('profileImage')?.setValue(file); // Establecer el archivo seleccionado en el control 'profileImage'
    }
  }

  delete() {
    this.url = null; // Eliminar la URL de la imagen
    this.form.get('profileImage')?.setValue(null); // Limpiar el campo de la imagen de perfil
  }

  submitForm() {
    if (this.form.invalid) { // Verificar si el formulario es inválido
      this.form.markAllAsTouched(); // Marcar todos los controles del formulario como tocados para mostrar errores de validación
      return;
    }

    if (!this.areAllStepsValid()) { // Verificar si todos los pasos del formulario son válidos
      console.log('Not all steps are valid'); // Mostrar mensaje si no todos los pasos son válidos
      return;
    }

    const formData = this.stablishRequest(); // Preparar el objeto FormData con los datos del formulario
    
    console.log('Request stablished'); // Mostrar mensaje de solicitud establecida
    console.log('Request object:', this.request); // Registrar el objeto request en la consola
    this.houseService // Llamar al método del servicio para crear una casa
      .createHouse(formData)
      .pipe()
      .subscribe({
        next: (response) => {
          // Manejar la respuesta exitosa (ej. mostrar un modal)
        },
        error: (err) => {
          console.error('Error creating house', err); // Manejar errores al crear la casa
        },
      });

    console.log(formData); // Mostrar el objeto FormData en la consola
    this.router.navigate(['/houses']); // Navegar a la lista de casas después de crear una nueva
  }
}

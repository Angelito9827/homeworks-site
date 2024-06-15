import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importaciones para FormBuilder y Validators
import { HouseService } from '../services/house-service/house.service'; // Importación del servicio HouseService
import { ActivatedRoute, Router } from '@angular/router'; // Importaciones para ActivatedRoute y Router
import { GetHouseByIdResponse } from '../models/get-house-by-id/get-house-by-id-response'; // Importación del modelo GetHouseByIdResponse
import { EditHouseRequest } from '../models/edit-house/edit-house.request'; // Importación del modelo EditHouseRequest
import { AuthService } from '../../auth/services/auth.service'; // Importación del servicio AuthService

@Component({
  selector: 'app-house-edit-delete',
  templateUrl: './house-edit-delete.component.html',
  styleUrls: ['./house-edit-delete.component.css'] // Establecer styleUrls para estilos específicos del componente
})
export class HouseEditDeleteComponent {
  user: string = ''; // Inicializar variable user
  form!: FormGroup; // Inicializar form como FormGroup
  url: any = ''; // Inicializar url variable
  houseResponse?: GetHouseByIdResponse; // Variable para almacenar la respuesta de la consulta de la casa
  attemptedSubmit: boolean = false; // Inicializar bandera attemptedSubmit
  request: EditHouseRequest = {} as EditHouseRequest; // Inicializar objeto request de tipo EditHouseRequest
  imageSelected: boolean = false; // Variable para indicar si se ha seleccionado una imagen
  id?: number; // Variable para almacenar el ID de la casa

  constructor(
    private formBuilder: FormBuilder, // Inyectar FormBuilder para la creación de formularios
    private houseService: HouseService, // Inyectar HouseService para métodos relacionados con las casas
    private activatedRoute: ActivatedRoute, // Inyectar ActivatedRoute para acceder a los parámetros de la ruta
    private router: Router,  // Inyectar Router para navegación
    private authService: AuthService // Inyectar AuthService para obtener el rol del usuario
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole(); // Obtener el rol del usuario actual
    this.activatedRoute.params
      .subscribe(params => {
        this.getHouseById(params['houseId']); // Obtener la información de la casa según el ID de la ruta
        this.id = params['houseId']; // Almacenar el ID de la casa
      });
    this.createForm(); // Llamar al método createForm al inicializar el componente
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]], // Definir control 'name' con validador requerido
      description: ['', [Validators.required]], // Definir control 'description' con validador requerido
      address: ['', [Validators.required]], // Definir control 'address' con validador requerido
      profileImage: [''], // Definir control 'profileImage' para la imagen de perfil
    });
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

  public delete() {
    this.url = 'assets/img/photo_camera.png'; // Establecer una imagen predeterminada
    this.form.get('profilePicture')?.setValue(null); // Limpiar el valor del control 'profilePicture'
  }

  private getHouseById(id: number) {
    this.houseService.getHouseById({ id: id }) // Llamar al método del servicio para obtener la información de la casa por ID
      .pipe()
      .subscribe({
        next: (response: GetHouseByIdResponse) => {
          this.houseResponse = response; // Almacenar la respuesta de la consulta
        }
      });
  }

  stablishRequest() {
    const formData = new FormData(); // Crear objeto FormData para enviar datos al servidor
    formData.append('id', this.id?.toString()!); // Agregar el ID de la casa al formulario
    formData.append('name', this.request.name = this.form.get('name')?.value); // Agregar el nombre al formulario y al objeto request
    formData.append('description', this.request.description = this.form.get('description')?.value); // Agregar la descripción al formulario y al objeto request
    formData.append('address', this.request.address = this.form.get('address')?.value); // Agregar la dirección al formulario y al objeto request

    const file = this.form.get('profileImage')?.value; // Obtener el archivo seleccionado para la imagen de perfil
    if (file) {
      formData.append('profileImage', file); // Agregar la imagen de perfil al formulario si existe
      this.request.profileImage = formData; // Asignar el objeto FormData al objeto request
    }

    return formData; // Devolver el objeto FormData construido
  }

  areAllStepsValid(): boolean {
    return this.form.valid; // Verificar si todos los pasos del formulario (controles) son válidos
  }

  saveForm() {
    if (this.form.invalid) { // Verificar si el formulario es inválido
      this.form.markAllAsTouched(); // Marcar todos los controles del formulario como tocados para mostrar errores de validación
      return;
    }
    
    if (!this.areAllStepsValid()) { // Verificar si todos los pasos del formulario son válidos
      console.log('Not all steps are valid'); // Mostrar mensaje si no todos los pasos son válidos
      return;
    }
    
    const request = this.stablishRequest(); // Preparar el objeto request con los datos del formulario
    console.log('Request stablished'); // Mostrar mensaje de solicitud establecida
    console.log('Request object:', this.request); // Registrar el objeto request en la consola

    this.houseService // Llamar al método del servicio para editar la casa
      .editHouse(request)
      .pipe()
      .subscribe({
        next: (houseResponse) => {
          // Manejar la respuesta exitosa
        },
        error: (err) => {
          // Manejar errores
        },
      });
    
    const houseId = this.houseResponse?.id; // Obtener el ID de la casa desde la respuesta
    this.router.navigate(['/houses', houseId]); // Navegar a la vista de detalles de la casa después de la edición
  }

  deleteHouseById() {
    console.log('Casa eliminada'); // Mostrar mensaje de que se está eliminando la casa
    this.houseService // Llamar al método del servicio para eliminar la casa por ID
      .deleteHouseById({ id: this.id! })
      .pipe()
      .subscribe({
        next: (houseResponse) => {
          // Manejar la respuesta exitosa
        },
        error: (err) => {
          // Manejar errores
        },
      });

    const closeButton = document.getElementById('x'); // Obtener el botón de cierre
    closeButton?.click(); // Simular clic en el botón de cierre para cerrar el modal
    
    this.router.navigate(['/houses']); // Navegar de regreso a la lista de casas
    alert("Casa eliminada correctamente"); // Mostrar alerta de éxito
  }
}

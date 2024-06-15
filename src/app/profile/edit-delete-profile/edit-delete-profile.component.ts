import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar FormBuilder, FormGroup y Validators desde Angular Forms
import { GetPerfilByIdResponse } from '../models/get-perfil-by-id.response'; // Importar modelo de respuesta GetPerfilByIdResponse
import { EditPerfilRequest } from '../models/edit-house/edit-perfil-request'; // Importar modelo de solicitud EditPerfilRequest
import { PerfilService } from '../services/perfil-service'; // Importar servicio PerfilService
import { ActivatedRoute, Router } from '@angular/router'; // Importar ActivatedRoute y Router de Angular Router
import { AuthService } from '../../auth/services/auth.service'; // Importar AuthService

@Component({
  selector: 'app-edit-delete-profile',
  templateUrl: './edit-delete-profile.component.html',
  styleUrls: ['./edit-delete-profile.component.css'] // Establecer styleUrls para estilos específicos del componente
})
export class EditDeleteProfileComponent {
  user: string = ''; // Variable para almacenar el rol del usuario
  form!: FormGroup; // Formulario del perfil
  url: any = ''; // Variable para almacenar la URL de la imagen seleccionada
  perfilResponse?: GetPerfilByIdResponse; // Respuesta del perfil obtenido por ID
  attemptedSubmit: boolean = false; // Bandera para controlar si se intentó enviar el formulario
  request: EditPerfilRequest = {} as EditPerfilRequest; // Solicitud de edición del perfil

  constructor(
    private perfilService: PerfilService, // Servicio PerfilService para la gestión del perfil
    private formBuilder: FormBuilder, // FormBuilder para la construcción del formulario
    private activatedRoute: ActivatedRoute, // ActivatedRoute para obtener parámetros de la ruta
    private router: Router, // Router para la navegación
    private authService: AuthService // AuthService para la gestión de la autenticación
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole(); // Obtener el rol del usuario desde AuthService al inicializar el componente
    this.activatedRoute.params // Suscripción a los parámetros de la ruta
      .subscribe(params => {
        this.getPerfilById(params['id']); // Obtener el perfil por ID al cambiar los parámetros de la ruta
      });
    this.createForm(); // Llamar al método para crear el formulario
  }

  createForm() {
    this.form = this.formBuilder.group({
      nickName: ['', [Validators.required]], // Campo 'nickName' requerido
      name: ['', [Validators.required]], // Campo 'name' requerido
      lastName: ['', [Validators.required]], // Campo 'lastName' requerido
      email: ['', [Validators.required, Validators.email]], // Campo 'email' requerido y validado como correo electrónico
      tlf: ['', [Validators.required, Validators.pattern('^[9|6|7][0-9]{8}$')]], // Campo 'tlf' requerido y validado con patrón de teléfono español
      profilePicture: [''] // Campo para la imagen de perfil
    });
  }

  onSelectFile(event: any) {
    if (event && event.target && event.target.files && event.target.files[0]) {
      var reader = new FileReader(); // Crear un lector de archivos

      reader.readAsDataURL(event.target.files[0]); // Leer el archivo como una URL

      reader.onload = (eventLoad) => { // Cuando se carga la imagen
        if (eventLoad && eventLoad.target) {
          this.url = eventLoad.target.result; // Establecer la URL de la imagen seleccionada
          console.log(this.url); // Mostrar la URL en la consola (opcional)
        }
      };
    }
  }

  public delete() {
    this.url = 'assets/img/photo_camera.png'; // Establecer la imagen por defecto al eliminar la imagen actual
    this.form.get('profilePicture')?.setValue(null); // Limpiar el campo de la imagen de perfil en el formulario
  }

  private getPerfilById(id: number) {
    this.perfilService.getPerfilById({ id: id }) // Obtener el perfil por ID utilizando el servicio PerfilService
      .pipe()
      .subscribe({
        next: (response: GetPerfilByIdResponse) => {
          this.perfilResponse = response; // Almacenar la respuesta del perfil obtenido
        }
      });
  }

  stablishRequest() {
    this.request.nickName = this.form.get('nickName')?.value; // Establecer el 'nickName' en la solicitud
    this.request.name = this.form.get('name')?.value; // Establecer el 'name' en la solicitud
    this.request.lastName = this.form.get('lastName')?.value; // Establecer el 'lastName' en la solicitud
    this.request.email = this.form.get('email')?.value; // Establecer el 'email' en la solicitud
    this.request.tlf = this.form.get('tlf')?.value; // Establecer el 'tlf' en la solicitud

    const file = this.form.get('profilePicture')?.value; // Obtener el archivo de imagen seleccionado

    if (file) {
      const formData = new FormData(); // Crear un objeto FormData para enviar datos de formulario
      formData.append('profilePicture', file); // Adjuntar la imagen al FormData
      this.request.profilePicture = formData; // Establecer el FormData en la solicitud
    }
  }

  areAllStepsValid(): boolean {
    return this.form.valid; // Verificar si todos los pasos del formulario son válidos
  }

  saveForm() {
    if (this.form.invalid) { // Si el formulario es inválido
      this.form.markAllAsTouched(); // Marcar todos los controles del formulario como tocados para mostrar errores de validación
      console.log('tocado'); // Mostrar en consola que se han tocado los controles (opcional)
      return;
    }

    if (!this.areAllStepsValid()) { // Si no todos los pasos del formulario son válidos
      console.log('Not all steps are valid'); // Mostrar en consola que no todos los pasos son válidos (opcional)
      return;
    }

    this.stablishRequest(); // Establecer la solicitud con los datos del formulario
    console.log('Request stablished'); // Mostrar en consola que la solicitud ha sido establecida (opcional)
    console.log('Request object:', this.request); // Mostrar en consola el objeto de solicitud (opcional)

    this.perfilService // Llamar al servicio PerfilService para editar el perfil
      .editPerfil(this.request)
      .pipe()
      .subscribe({
        next: (perfilResponse) => {
          // Manejar la respuesta exitosa del servicio (opcional)
        },
        error: (err) => {
          // Manejar el error del servicio (opcional)
        },
      });

    alert("Guardado correctamente"); // Mostrar alerta de guardado exitoso

    const perfilId = this.perfilResponse?.id; // Obtener el ID del perfil (opcional)
    this.router.navigate(['/profile']); // Navegar a la ruta '/profile' después de guardar el perfil
  }

  deletePerfil() {
    console.log('Perfil eliminado'); // Mostrar en consola que el perfil ha sido eliminado (opcional)

    this.perfilService // Llamar al servicio PerfilService para eliminar el perfil
      .deletePerfil(this.request)
      .pipe()
      .subscribe({
        next: (perfilResponse) => {
          // Manejar la respuesta exitosa del servicio (opcional)
        },
        error: (err) => {
          // Manejar el error del servicio (opcional)
        },
      });

    const closeButton = document.getElementById('x'); // Obtener el botón de cierre (opcional)
    closeButton?.click(); // Simular clic en el botón de cierre (opcional)

    this.router.navigate(['']); // Navegar a la ruta raíz después de eliminar el perfil
    alert("eliminado correctamente");  // Mostrar alerta de eliminación exitosa
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value; // Obtener el valor del campo 'password' del formulario
    const rePassword = form.get('rePassword')?.value; // Obtener el valor del campo 'rePassword' del formulario

    if (password !== rePassword) { // Si las contraseñas no coinciden
      form.get('rePassword')?.setErrors({ passwordsMismatch: true }); // Establecer error 'passwordsMismatch' en el campo 'rePassword'
    } else {
      form.get('rePassword')?.setErrors(null); // Limpiar errores si las contraseñas coinciden
    }
    return null; // Retornar null (validación pasada)
  }

}

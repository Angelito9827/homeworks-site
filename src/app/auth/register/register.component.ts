import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importaciones para FormBuilder y Validators
import { ActivatedRoute, Router } from '@angular/router'; // Importaciones para ActivatedRoute y Router
import { CreatePerfilRequest } from '../models/create-perfil/create-perfil.request'; // Importación del modelo CreatePerfilRequest
import { AuthService } from '../services/auth.service'; // Importación del servicio AuthService

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Establecer styleUrls para estilos específicos del componente
})
export class RegisterComponent {
  form!: FormGroup; // Inicializar form como FormGroup
  url: any = ''; // Inicializar variable url
  fieldErrors: { [key: string]: boolean } = {}; // Inicializar fieldErrors como un objeto
  request: CreatePerfilRequest = {} as CreatePerfilRequest; // Inicializar objeto request de tipo CreatePerfilRequest
  attemptedSubmit: boolean = false; // Inicializar bandera attemptedSubmit

  constructor(
    private formBuilder: FormBuilder, // Inyectar FormBuilder para la creación de formularios
    private authService: AuthService, // Inyectar AuthService para métodos de autenticación
    private router: Router, // Inyectar Router para navegación
    private activatedRoute: ActivatedRoute // Inyectar ActivatedRoute para acceder a los parámetros de ruta
  ) {}

  ngOnInit(): void {
    this.authService.setIsLoginPage(true); // Establecer el estado de la página de inicio de sesión al inicializar el componente
    this.activatedRoute.params.subscribe(params => {
      this.createForm(); // Llamar al método createForm cuando cambian los parámetros de la ruta
    });
  }

  ngOnDestroy(): void { // Método ejecutado al destruir el componente
    this.authService.setIsLoginPage(false); // Actualizar el estado de la página de inicio de sesión a falso al destruir el componente
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]], // Definir control 'name' con validador requerido
      lastName: ['', [Validators.required]], // Definir control 'lastName' con validador requerido
      nickName: ['', [Validators.required]], // Definir control 'nickName' con validador requerido
      email: ['', [Validators.required, Validators.email]], // Definir control 'email' con validadores requerido y de correo electrónico
      tlf: ['', [Validators.required, Validators.pattern('^[9|6|7][0-9]{8}$')]], // Definir control 'tlf' con validadores requerido y de patrón de teléfono
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$')]], // Definir control 'password' con validadores requerido y de patrón de contraseña
      rePassword: ['', Validators.required] // Definir control 'rePassword' con validador requerido
    }, { validators: this.passwordMatchValidator }); // Agregar validador personalizado para la coincidencia de contraseñas
  }

  stablishRequest() {
    // Asignar los valores del formulario al objeto request
    this.request.name = this.form.get('name')?.value;
    this.request.lastName = this.form.get('lastName')?.value;
    this.request.userName = this.form.get('nickName')?.value;
    this.request.email = this.form.get('email')?.value;
    this.request.tlf = this.form.get('tlf')?.value;
    this.request.password = this.form.get('password')?.value;
    this.request.rePassword = this.form.get('rePassword')?.value;
  }

  areAllStepsValid(): boolean {
    return this.form.valid; // Verificar si todos los pasos del formulario (controles) son válidos
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

    this.stablishRequest(); // Establecer el objeto request con los valores del formulario
    console.log('Request stablished'); // Mostrar mensaje de solicitud establecida
    console.log('Request object:', this.request); // Registrar el objeto request en la consola

    this.authService.createPerfil(this.request) // Llamar al método del servicio AuthService para crear el perfil
    .pipe()
    .subscribe({
      next: (response) => {
        // Manejar la respuesta exitosa
      },
      error: (err) => {
        console.error('Error creating perfil', err); // Registrar mensaje de error si falla la creación del perfil
      }
    });

    this.router.navigate(['/houses']); // Navegar a la ruta '/houses' después de enviar el formulario
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value; // Obtener el valor del control 'password'
    const rePassword = form.get('rePassword')?.value; // Obtener el valor del control 'rePassword'

    if (password !== rePassword) { // Verificar si las contraseñas no coinciden
      form.get('rePassword')?.setErrors({ passwordsMismatch: true }); // Establecer el error 'passwordsMismatch' al control 'rePassword'
    } else {
      form.get('rePassword')?.setErrors(null); // Borrar errores si las contraseñas coinciden
    }
    return null; // Devolver null (validación pasada)
  }

}

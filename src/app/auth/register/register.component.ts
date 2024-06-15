import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePerfilRequest } from '../models/create-perfil/create-perfil.request';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form!: FormGroup;
  url: any = '';
  fieldErrors: { [key: string]: boolean } = {};
  request: CreatePerfilRequest = {} as CreatePerfilRequest;
  attemptedSubmit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.setIsLoginPage(true);
    this.activatedRoute.params.subscribe(params => {
      this.createForm();
    });
  }

  ngOnDestroy(): void { // Método que se ejecuta al destruir el componente
    this.authService.setIsLoginPage(false); // Llama al método setIsLoginPage del servicio AuthService para indicar que la página actual ya no es la de inicio de sesión
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      nickName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      tlf: ['', [Validators.required,Validators.pattern('^[9|6|7][0-9]{8}$')]],
      password: ['', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$')]],
      rePassword: ['', Validators.required]}, { validators: this.passwordMatchValidator });
  }

  stablishRequest() {
    this.request.name = this.form.get('name')?.value;
    this.request.lastName = this.form.get('lastName')?.value;
    this.request.userName = this.form.get('nickName')?.value;
    this.request.email = this.form.get('email')?.value;
    this.request.tlf = this.form.get('tlf')?.value;
    this.request.password = this.form.get('password')?.value;
    this.request.rePassword = this.form.get('rePassword')?.value;
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

    this.stablishRequest();
    console.log('Request stablished');
    console.log('Request object:', this.request);

    this.authService.createPerfil(this.request)
    .pipe()
    .subscribe({
      next: (response) => {
        // Manejar la respuesta exitosa
      },
      error: (err) => {
        console.error('Error creating perfil', err);
      }
    });

    this.router.navigate(['/houses']);
  }

  passwordMatchValidator(form:FormGroup) {
    const password = form.get('password')?.value;
    const rePassword = form.get('rePassword')?.value;

    if (password !== rePassword) {
      form.get('rePassword')?.setErrors({passwordsMismatch: true});
    } else {
      form.get('rePassword')?.setErrors(null);
    }
    return null;
  }

}


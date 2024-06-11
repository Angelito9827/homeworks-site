import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPerfilByIdResposne } from './models/get-perfil-by-id.response';
import { PerfilService } from './services/perfil-service';
import { EditPerfilRequest } from './models/edit-house/edit-perfil-request';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: string = '';
  form!: FormGroup;
  url: any = '';
  perfilResponse?: GetPerfilByIdResposne;
  attemptedSubmit: boolean = false;
  request: EditPerfilRequest = {} as EditPerfilRequest;

  constructor(
    private perfilService: PerfilService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRole();
    this.activatedRoute.params
    .subscribe(params=>{
      this.getPerfilById(params['id']);
    })
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      nickName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      tlf: ['', [Validators.required,Validators.pattern('^[9|6|7][0-9]{8}$')]],
      profilePicture: [''],
      password: ['', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$')]],
      rePassword: ['', Validators.required]}, { validators: this.passwordMatchValidator });
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

  private getPerfilById(id:number) {
    this.perfilService.getPerfilById({id:id})
    .pipe()
    .subscribe({
      next: (response: GetPerfilByIdResposne) => {
        this.perfilResponse = response;
      }
    })
   }

   stablishRequest() {
     this.request.nickName = this.form.get('nickName')?.value;
     this.request.name = this.form.get('name')?.value;
     this.request.lastName = this.form.get('lastName')?.value;
     this.request.email = this.form.get('email')?.value;
     this.request.tlf = this.form.get('tlf')?.value;
     const file = this.form.get('profileImage')?.value;
     if (file) {
       const formData = new FormData();
       formData.append('profileImage', file);
       this.request.profilePicture = formData;
      }
    }

    areAllStepsValid(): boolean {
    return this.form.valid;
  }

  logOut() {
    this.authService.logOut(); // Llama al método de cierre de sesión del servicio de usuario

    const closeButton = document.getElementById('x');
    closeButton?.click();
    
    this.router.navigate(['']); // Navega a la página de inicio de sesión después de cerrar sesión
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

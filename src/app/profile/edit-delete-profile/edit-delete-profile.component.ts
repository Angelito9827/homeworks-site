import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetPerfilByIdResposne } from '../models/get-perfil-by-id.response';
import { EditPerfilRequest } from '../models/edit-house/edit-perfil-request';
import { PerfilService } from '../services/perfil-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';


@Component({
  selector: 'app-edit-delete-profile',
  templateUrl: './edit-delete-profile.component.html',
  styleUrl: './edit-delete-profile.component.css'
})
export class EditDeleteProfileComponent {
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
      profilePicture: ['']});
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
  
  saveForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('tocado');
      return;
    }
    
    if (!this.areAllStepsValid()) {
      console.log('Not all steps are valid');
      return;
    }
    
    this.stablishRequest();
    console.log('Request stablished');
    console.log('Request object:', this.request);
    this.perfilService
    .editPerfil(this.request)
    .pipe()
    .subscribe({
      next: (perfilResponse) => {
      },
      error: (err) => {},
    });
    
    alert("Guardado correctamente");
    
    const perfilId = this.perfilResponse?.id;
    this.router.navigate(['/profile']);
    
  }

  deletePerfil() {
    console.log('Perfil eliminado');
    this.perfilService
    .deletePerfil(this.request)
    .pipe()
    .subscribe({
      next: (perfilResponse) => {
      },
      error: (err) => {},
    });
    
    const closeButton = document.getElementById('x');
    closeButton?.click();
    
    this.router.navigate(['']);
    alert("eliminado correctamente"); 
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

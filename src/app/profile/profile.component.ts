import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPerfilByIdResposne } from './models/get-perfil-by-id.response';
import { PerfilService } from './services/perfil-service';
import { EditPerfilRequest } from './models/edit-house/edit-perfil-request';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  form!: FormGroup;
  url: any = '';
  perfilResponse?: GetPerfilByIdResposne;
  attemptedSubmit: boolean = false;
  request: EditPerfilRequest = {} as EditPerfilRequest;

  constructor(
    private perfilService: PerfilService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

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
      tlf: ['', [Validators.required]],
      profilePicture: [''],
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
    this.router.navigate(['/perfil']);
    
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

}

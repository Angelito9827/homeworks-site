import { Component } from '@angular/core';
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
  url: any = '';
  perfilResponse?: GetPerfilByIdResposne;
  attemptedSubmit: boolean = false;
  request: EditPerfilRequest = {} as EditPerfilRequest;

  constructor(
    private perfilService: PerfilService,
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

  logOut() {
    this.authService.logOut(); // Llama al método de cierre de sesión del servicio de usuario

    const closeButton = document.getElementById('x');
    closeButton?.click();
    
    this.router.navigate(['']); // Navega a la página de inicio de sesión después de cerrar sesión
  }

}

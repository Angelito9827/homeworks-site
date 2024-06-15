import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user!: string; // Variable para almacenar el rol del usuario
  isLoggedIn: boolean = false; // Variable para verificar si el usuario está conectado
  private userRoleSubscription: Subscription | undefined; // Suscripción al cambio de rol del usuario

  constructor(public authService: AuthService) { } // Inyecta el servicio de usuario en el constructor

  ngOnInit(): void {
    // Suscribirse al estado de inicio de sesión del usuario
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn; // Actualiza el estado de inicio de sesión
      this.getUser(); // Obtiene el rol del usuario
    });

    // Suscribirse a los cambios en el rol del usuario
    this.userRoleSubscription = this.authService.getRoleSubject().subscribe(role => {
      this.user = role; // Actualiza el rol del usuario
    });

    this.getUser(); // Obtiene el rol del usuario al inicializar el componente
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.userRoleSubscription) {
      this.userRoleSubscription.unsubscribe();
    }
  }

  // Método para obtener el rol del usuario
  private getUser() {
    this.user = this.authService.getRole(); // Obtiene el rol del usuario del servicio
  }

}



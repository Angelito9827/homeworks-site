import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  
  constructor(private authService: AuthService) { }

  ngOnInit(): void { // Método que se ejecuta al inicializar el componente
    this.authService.setIsLoginPage(true); // Llama al método setIsLoginPage del servicio AuthService para indicar que la página actual es la de inicio de sesión
  }

  ngOnDestroy(): void { // Método que se ejecuta al destruir el componente
    this.authService.setIsLoginPage(false); // Llama al método setIsLoginPage del servicio AuthService para indicar que la página actual ya no es la de inicio de sesión
  }
}

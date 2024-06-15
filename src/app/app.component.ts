import { ChangeDetectorRef, Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'homeworks-site';
  isLoginPage: boolean = false;

  baseUrl = environment.baseUrlApi

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) { }

  // Método que se llama cuando se inicializa el componente
  ngOnInit() {
    // Suscribirse al observable que indica si es la página de inicio de sesión
    this.authService.getIsLoginPage().subscribe(isLoginPage => {
      this.isLoginPage = isLoginPage; // Actualizar la variable isLoginPage
      this.cdr.detectChanges(); // Notificar a Angular de los cambios para actualizar la vista
    });
  }
}

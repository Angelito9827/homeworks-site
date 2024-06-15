import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = ""; // Variable para almacenar el correo electrónico del usuario
  password: string = ""; // Variable para almacenar la contraseña del usuario
  error: string = ""; // Variable para almacenar mensajes de error

  constructor(private router: Router, private authService: AuthService) { } // Constructor del LoginComponent que inyecta UserService, Router y AuthService

  ngOnInit(): void { // Método que se ejecuta al inicializar el componente
    this.authService.setIsLoginPage(true); // Llama al método setIsLoginPage del servicio AuthService para indicar que la página actual es la de inicio de sesión
  }

  ngOnDestroy(): void { // Método que se ejecuta al destruir el componente
    this.authService.setIsLoginPage(false); // Llama al método setIsLoginPage del servicio AuthService para indicar que la página actual ya no es la de inicio de sesión
  }

  login() { // Método para iniciar sesión
    // Convertir el email a minúsculas
    const emailLowerCase = this.email.toLowerCase();

    // Validar campos vacíos
    if (!emailLowerCase || !this.password) {
      this.error = "Por favor ingresa tu correo electrónico y contraseña.";
      return;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLowerCase)) {
      this.error = "Por favor ingresa un correo electrónico válido.";
      return;
    }

    // Encriptar la contraseña con SHA-256
    const hashedPassword = sha256(this.password);

    const user = { email: emailLowerCase, password: hashedPassword }; // Crear un objeto usuario con el email y la contraseña encriptada
    this.authService.login(user) // Llama al método login del servicio UserService para autenticar al usuario
      .pipe() // Permite operaciones adicionales en la secuencia de observables
      .subscribe((data: any) => { // Suscribe una función para manejar la respuesta exitosa del servidor
        const role = this.authService.getUser(emailLowerCase); // Obtiene el rol del usuario
        if (!role) { // Si no se encuentra un rol para el usuario
          this.error = "Correo electrónico o contraseña incorrectos."; // Muestra un mensaje de error
          return;
        }
        this.authService.setToken(data.token);
        this.authService.setRole(role);  // Guarda el token de autenticación en el servicio UserService
        if (role === 'user') { // Si el rol del usuario es 'user'
          this.router.navigateByUrl("/houses"); // Redirige a la página de inicio
        } else { // Si el rol no es reconocido
          console.log("Usuario no reconocido"); // Muestra un mensaje en la consola
        }
      },
        error => { // Suscribe una función para manejar errores
          console.log(error); // Muestra el error en la consola
          this.error = "Correo electrónico o contraseña no válidos."; // Muestra un mensaje de error
        });
  }
}

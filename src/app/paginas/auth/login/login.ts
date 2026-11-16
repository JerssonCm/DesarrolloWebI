import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  formularioLogin;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formularioLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  iniciarSesion() {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const datos = this.formularioLogin.value;

    this.authService.iniciarSesion({
      email: datos.correo!,
      password: datos.password!
    }).subscribe({
      next: (respuesta) => {
        alert('¡Inicio de sesión exitoso!');

        if (respuesta.usuario.rol?.toUpperCase() === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        alert('No se pudo iniciar sesión. Verifica tu correo y contraseña.');
      }
    });
  }
}

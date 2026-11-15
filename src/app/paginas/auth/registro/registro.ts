
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  formularioRegistro;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', [Validators.required]]
    });
  }

  registrarUsuario() {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    const datos = this.formularioRegistro.value;

    if (datos.password !== datos.confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.authService.registrar({
      nombre: datos.nombre!,
      email: datos.correo!,
      password: datos.password!
    }).subscribe({
      next: (respuesta) => {
        alert(respuesta);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const mensaje = typeof error.error === 'string'
          ? error.error
          : 'No se pudo completar el registro. Inténtalo nuevamente.';

        alert(mensaje);
      }
    });
  }
}
